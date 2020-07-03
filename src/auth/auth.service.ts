import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import UsersService from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';
import { AppMailerService } from '../appmailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appMailerService: AppMailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (await user.comparePassword(pass)) {
      return user;
    }
    return null;
  }

  async login(user: UserDto) {
    const payload = { id: user.id, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    const id = user ? user.id : 0;
    const today = new Date();
    const payload = {
      email: email,
      code: today.getFullYear() + (today.getMonth() + 1) + today.getDate() + id,
    };
    const keyword = this.jwtService.sign(payload);
    const response = await this.appMailerService.resetPasswordMail(
      keyword,
      email,
    );
    return response;
  }

  async verifyToken(keyword: string, today: Date) {
    const result = this.jwtService.verify(keyword, { complete: true });
    if (!result) throw new BadRequestException('Invalid token');
    const { payload, ...data } = result;
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new BadRequestException('Invalid token');
    const validCode: number =
      today.getFullYear() + (today.getMonth() + 1) + today.getDate() + user.id;
    if (payload.code !== validCode)
      throw new BadRequestException('Invalid tolen');
    return {
      message: `Valid token, now you can send the new password!`,
      email: user.email,
    };
  }
}
