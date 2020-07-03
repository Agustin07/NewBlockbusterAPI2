import { Controller, Get, Post, UseGuards, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import {
  UserDto,
  AuthedUserDto,
  resetPasswordDto,
  newPasswordDto,
} from './users/dto/user.dto';
import { User } from './users/user.decorator';
import { AppMailerService } from './appmailer.service';
import UsersService from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDto) {
    return await this.authService.login(user);
  }

  @Post('resetPassword')
  async resetPassword(@Body() reset: resetPasswordDto) {
    const response = await this.authService.resetPassword(reset.email);
    return response;
  }

  @Get('reset/:keyword')
  async verifyReset(@Param('keyword') keyword: string) {
    const response = await this.authService.verifyToken(keyword, new Date());
    return response.message;
  }

  @Post('reset/:keyword')
  async doReset(
    @Param('keyword') keyword: string,
    @Body() newpassword: newPasswordDto,
  ) {
    const response = await this.authService.verifyToken(keyword, new Date());
    const message = await this.userService.resetPassword(
      response.email,
      newpassword.password,
    );
    return message;
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
