import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userDTo1, authUser, user1 } from './users/mocks/users.mocks';
import { AuthService } from './auth/auth.service';
import UsersService from './users/users.service';
import { resetPasswordDto, newPasswordDto } from './users/dto/user.dto';

const FakeUsersService = {
  resetPassword: jest.fn(),
};

const FakeAuthService = {
  login: jest.fn((user) => {
    return { access_token: 'givin a token 🛂' };
  }),
  resetPassword: jest.fn(),
  verifyToken: jest.fn(),
};

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: FakeAuthService,
        },
        {
          provide: UsersService,
          useValue: FakeUsersService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
    userService = app.get<UsersService>(UsersService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('login', () => {
    it('should return a jwt-key', async () => {
      const spy = jest.spyOn(authService, 'login').mockImplementation();
      await appController.login(userDTo1);
      expect(spy).toHaveBeenCalledWith(userDTo1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('should return message "mail sent" ', async () => {
      //inputs
      const reset: resetPasswordDto = { email: 'rigoomartinez@gmail.com' };
      //mocks implementations
      const spyReset = jest
        .spyOn(authService, 'resetPassword')
        .mockImplementation(() => {
          return Promise.resolve('mail sent');
        });
      //outputs
      const expected = 'mail sent';
      //excecute
      const res = await appController.resetPassword(reset);
      //validation
      expect(res).toEqual(expected);
      expect(spyReset).toHaveBeenCalled();
    });
  });

  describe('verifyReset', () => {
    it('should return message `Valid token, now you can send the new password!` ', async () => {
      //inputs
      const keyword = 'k12345';
      //mocks implementations
      const spyVerify = jest
        .spyOn(authService, 'verifyToken')
        .mockImplementation(() => {
          return Promise.resolve({
            message: `Valid token, now you can send the new password!`,
            email: 'rigoomartinez@gmail.com',
          });
        });
      //outputs
      const expected = `Valid token, now you can send the new password!`;
      //excecute
      const res = await appController.verifyReset(keyword);
      //validation
      expect(res).toEqual(expected);
      expect(spyVerify).toHaveBeenCalled();
    });
  });

  describe('doReset', () => {
    it('should return message `Valid token, now you can send the new password!` ', async () => {
      //inputs
      const keyword = 'k12345';
      const newpassword: newPasswordDto = { password: 'squirtle' };
      //mocks implementations
      const spyVerify = jest
        .spyOn(authService, 'verifyToken')
        .mockImplementation(() => {
          return Promise.resolve({
            message: `Valid token, now you can send the new password!`,
            email: 'rigoomartinez@gmail.com',
          });
        });
      const spyResetPassword = jest
        .spyOn(userService, 'resetPassword')
        .mockImplementation(() => {
          return Promise.resolve('Password successfully reset!');
        });
      //outputs
      const expected = 'Password successfully reset!';
      //excecute
      const res = await appController.doReset(keyword, newpassword);
      //validation
      expect(res).toEqual(expected);
      expect(spyVerify).toHaveBeenCalled();
      expect(spyResetPassword).toHaveBeenCalled();
    });
  });
});
