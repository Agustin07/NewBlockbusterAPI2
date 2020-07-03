import { Test, TestingModule } from '@nestjs/testing';
import UsersService from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import {
  user1,
  roleClient,
  createUser,
  updteUserDto,
  roleAdmin,
} from './mocks/users.mocks';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AssignRoleDto, UpdatePasswordDto } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repoUser: Repository<User>;
  let repoRole: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        { provide: getRepositoryToken(Role), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repoUser = module.get<Repository<User>>(getRepositoryToken(User));
    repoRole = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUsers', () => {
    it('should be defined', () => {
      expect(service.getUsers).toBeDefined();
    });
    it('call repoUser.find()', () => {
      const result = [user1];
      const getUsersspy = jest
        .spyOn(repoUser, 'find')
        .mockImplementation(() => {
          return Promise.resolve(result);
        });
      service.getUsers();
      expect(getUsersspy).toBeCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });
    it('calls in createUser', async () => {
      const user = user1;
      const role = roleClient;
      const createDto = createUser;
      const spyfindemail = jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      const spyfindOne = jest
        .spyOn(repoRole, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(role);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyFindemail = jest
        .spyOn(repoUser, 'save')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      await service.createUser(createDto);
      expect(spyfindemail).toHaveBeenCalled();
      expect(spyfindOne).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyFindemail).toHaveBeenCalled();
    });

    it('should thow Conflit', async () => {
      const user = user1;
      const createDto = createUser;
      const spyfindemail = jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      try {
        const res = await service.createUser(createDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(spyfindemail).toHaveBeenCalled();
      }
    });
  });

  describe('updateUser', () => {
    it('should be defined', () => {
      expect(service.updateUser).toBeDefined();
    });
    it('calls in updateUser', async () => {
      const user = user1;
      const updtUser = updteUserDto;
      const spygetUserByIdOrThrow = jest
        .spyOn(service, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyFindemail = jest
        .spyOn(repoUser, 'save')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      await service.updateUser(user.id, updtUser);
      expect(spygetUserByIdOrThrow).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyFindemail).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should be defined', () => {
      expect(service.deleteUser).toBeDefined();
    });
    it('calls in createUser', async () => {
      const user = user1;
      const spygetUserByIdOrThrow = jest
        .spyOn(service, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyFindemail = jest
        .spyOn(repoUser, 'save')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      expect(await service.deleteUser(user.id)).toBe(null);
      expect(spygetUserByIdOrThrow).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyFindemail).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return message ', async () => {
      //inputs
      const email = 'rigoomartinez@gmail.com';
      const user = user1;
      //mocks implementations
      const spyFindByEmail = jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      //outputs
      const expected = user;
      //excecute
      const res = await service.findOneByEmail(email);
      //validation
      expect(res).toEqual(expected);
      expect(spyFindByEmail).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      //inputs
      const email = 'rigoomartinez@gmail.com';
      const user = undefined;
      //mocks implementations
      const spyFindByEmail = jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      //outputs
      const expected = NotFoundException;
      //excecute
      try {
        const res = await service.findOneByEmail(email);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
      }
    });
  });

  describe('findRoleByNameOrThrow', () => {
    it('should return Role ', async () => {
      //inputs
      const name = 'CLIENT';
      const role = roleClient;
      //mocks implementations
      const spyfindOne = jest
        .spyOn(repoRole, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(role);
        });
      //outputs
      const expected = roleClient;
      //excecute
      const res = await service.findRoleByNameOrThrow(name);
      //validation
      expect(res).toEqual(expected);
      expect(spyfindOne).toHaveBeenCalled();
    });

    it('should throw BadRequestException ', async () => {
      //inputs
      const name = 'CLIENT';
      const role = undefined;
      //mocks implementations
      const spyfindOne = jest
        .spyOn(repoRole, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(role);
        });
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.findRoleByNameOrThrow(name);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
      }
    });
  });

  describe('assignRole', () => {
    it('should return User ', async () => {
      //inputs
      const data: AssignRoleDto = {
        email: 'rigoomartinez@gmail.com',
        name: 'ADMIN',
      };
      const user = user1;
      const role = roleAdmin;
      //mocks implementations
      const spy1 = jest
        .spyOn(service, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spy2 = jest
        .spyOn(service, 'findRoleByNameOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(role);
        });
      const spy3 = jest.spyOn(repoUser, 'create').mockImplementation(() => {
        return user;
      });
      const spy4 = jest.spyOn(repoUser, 'save').mockImplementation(() => {
        return Promise.resolve(user);
      });
      //outputs
      const expected = user;
      //excecute
      const res = await service.assignRole(data);
      //validation
      expect(res).toEqual(expected);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should return a message', async () => {
      //inputs
      const id = 1;
      const password: UpdatePasswordDto = {
        old: 'oldPassword',
        new: 'newPassword',
      };
      const user = user1;
      //mocks implementations
      const spygetUserByIdOrThrow = jest
        .spyOn(service, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyfindOneByEmail = jest
        .spyOn(service, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycompare = jest
        .spyOn(user, 'comparePassword')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyhash = jest
        .spyOn(user, 'hashPassword')
        .mockImplementation(() => {
          return Promise.resolve();
        });
      const spysave = jest.spyOn(repoUser, 'save').mockImplementation(() => {
        return Promise.resolve(user);
      });
      //outputs
      const expected = 'Password changed successfully!';
      //excecute
      const res = await service.changePassword(id, password);
      //validation
      expect(res).toEqual(expected);
      expect(spygetUserByIdOrThrow).toHaveBeenCalled();
      expect(spyfindOneByEmail).toHaveBeenCalled();
      expect(spycompare).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyhash).toHaveBeenCalled();
      expect(spysave).toHaveBeenCalled();
    });

    it('should throw BadRequestException ', async () => {
      //inputs
      const id = 1;
      const password: UpdatePasswordDto = {
        old: 'oldPassword',
        new: 'newPassword',
      };
      const user = user1;
      //mocks implementations
      const spygetUserByIdOrThrow = jest
        .spyOn(service, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyfindOneByEmail = jest
        .spyOn(service, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycompare = jest
        .spyOn(user, 'comparePassword')
        .mockImplementation(() => {
          return Promise.resolve(false);
        });
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.changePassword(id, password);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
      }
    });
  });

  describe('resetPassword', () => {
    it('should return a message', async () => {
      //inputs
      const email = 'rigoomartinez@gmail.com';
      const password = 'charmeleon';
      const user = user1;
      //mocks implementations
      const spyfindOneByEmail = jest
        .spyOn(service, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyhash = jest
        .spyOn(user, 'hashPassword')
        .mockImplementation(() => {
          return Promise.resolve();
        });
      const spysave = jest.spyOn(repoUser, 'save').mockImplementation(() => {
        return Promise.resolve(user);
      });
      //outputs
      const expected = 'Password successfully reset!';
      //excecute
      const res = await service.resetPassword(email, password);
      //validation
      expect(res).toEqual(expected);
      expect(spyfindOneByEmail).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyhash).toHaveBeenCalled();
      expect(spysave).toHaveBeenCalled();
    });
  });
});
