import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, AssignRoleDto, UpdatePasswordDto } from './dto/user.dto';
import { Role } from './entities/role.entity';
import { updteUserDto } from './mocks/users.mocks';

@Injectable()
class UsersService {
  constructor(
    @InjectRepository(User)
    private repoUsers: Repository<User>,
    @InjectRepository(Role)
    private repoRole: Repository<Role>,
  ) {}

  getUsers() {
    return this.repoUsers.find({ where: { isActive: true } });
  }

  async getUserByIdOrThrow(id: number) {
    const user = await this.repoUsers
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException(`No user with id:${id} found!`);
    }
    return user;
  }

  async getUserWithRentalOrThrow(id: number) {
    const user = await this.repoUsers
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.rentals',
        'rentals',
        'rentals.status = :status',
        { status: 1 },
      )
      .leftJoinAndSelect('rentals.movie', 'movie')
      .where('user.id = :id', { id: id })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException(`No user with id:${id} found!`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.repoUsers
      .createQueryBuilder('user')
      .addSelect('user.password')
      .innerJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async findOneByEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user with email:${email} found!`);
    }
    return user;
  }

  async findRoleByNameOrThrow(name: string) {
    const role = await this.repoRole.findOne({where: {name:name}});
    if (!role) throw new BadRequestException(`Role ${name} not found`);
    return role;
  }

  async createUser(data: CreateUserDto) {
    let userExists = await this.findByEmail(data.email);
    if (userExists) {
      throw new ConflictException(
        `User with email: ${data.email} already exists!`,
      );
    }
    const role = await this.repoRole.findOne(2);
    const user = this.repoUsers.create({
      email: data.email,
      username: data.username,
      password: data.password,
      role: role,
    });
    return await this.repoUsers.save(user);
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.getUserByIdOrThrow(id);
    const mergeUser = this.repoUsers.create({
      ...user,
      ...data
    });
    const updatedUser = await this.repoUsers.save(mergeUser);
    return updatedUser;
  }

  async deleteUser(id: number) {
    const user = await this.getUserByIdOrThrow(id);

    const mergeUser = this.repoUsers.create({
      ...user,
      isActive: false,
      deletedAt: new Date(),
    });
    const deletedUser = await this.repoUsers.save(mergeUser);
    return null;
  }

  async assignRole(data: AssignRoleDto): Promise<User> {
    const user = await this.findOneByEmail(data.email);
    const role = await this.findRoleByNameOrThrow(data.name);
    const updatedUser = this.repoUsers.create({
      ...user, role: role,
    });
    const result = await this.repoUsers.save(updatedUser);
    return result;
  }

  async changePassword(id: number, password: UpdatePasswordDto) {
    const user = await this.getUserByIdOrThrow(id);
    const completeUser = await this.findOneByEmail(user.email);
    const result = await completeUser.comparePassword(password.old);
    if(!result) throw new BadRequestException('Invalid password');
    const updatedUser = this.repoUsers.create({...completeUser,password: password.new});
    await updatedUser.hashPassword();
    await this.repoUsers.save(updatedUser);
    return 'Password changed successfully!'
  }

  async resetPassword(email: string, password: string){
    const user = await this.findOneByEmail(email);
    const updatedUser = this.repoUsers.create({...user,password: password});
    await updatedUser.hashPassword();
    await this.repoUsers.save(updatedUser);
    return 'Password successfully reset!'
  }

}

export default UsersService;
