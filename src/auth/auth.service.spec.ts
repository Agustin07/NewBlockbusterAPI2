import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import UsersService from '../users/users.service';
import { user1, userDTo1 } from '../users/mocks/users.mocks';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AppMailerService } from '../appmailer.service';
import { use } from 'passport';

const mock_UsersService = {
  findByEmail: jest.fn(),
  findOneByEmail: jest.fn(),
};
const mock_jwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mock_appMailerService= {
  resetPasswordMail: jest.fn(),
}

const fakeUser = {
  comparePassword: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let appMailerService: AppMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mock_UsersService },
        { provide: JwtService, useValue: mock_jwtService },
        { provide: AppMailerService, useValue: mock_appMailerService },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    appMailerService = module.get<AppMailerService>(AppMailerService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });
    it('should validate user', async () => {
      const user = user1;
      const spyfindOneByEmail = jest
        .spyOn(usersService, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      expect(await service.validateUser(user.email, 'pineapple')).toBe(user);
      expect(spyfindOneByEmail).toHaveBeenCalledTimes(1);
    });
    it('should throw on invalid password', async () => {
      const user = user1;
      const spyfindOneByEmail = jest
        .spyOn(usersService, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyFakeUser = jest
        .spyOn(user, 'comparePassword')
        .mockImplementation(() => {
          return Promise.resolve(false);
        });
      
      const res = await service.validateUser('rigoomartinez@gmail.com', 'wrongPassword');
      expect(res).toBe(null);
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });
    it('should return {access_token: jwtToken}', async () => {
      const ImAToken = '$hklknhmlhKUG6D8.onhIGUKhnGKMhg';
      const userDto = userDTo1;
      const spysign = jest.spyOn(jwtService,'sign').mockImplementation(()=>ImAToken);
      const expected = {access_token: '$hklknhmlhKUG6D8.onhIGUKhnGKMhg'};
      expect(await service.login(userDto)).toEqual(expected);
      expect(spysign).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should be defined', () => {
      expect(service.resetPassword).toBeDefined();
    });
    it('should return "mail sent"', async () => {
      //inputs
      const ImAToken = 'ey12345';
      const email="rigoomartinez@gmail.com";
      const user=user1;
      //mocks implementations
      const spyFBEmail = jest.spyOn(usersService,'findByEmail').mockImplementation(()=>{return Promise.resolve(user)});
      const spySign = jest.spyOn(jwtService,'sign').mockImplementation(()=>ImAToken);
      const spyResetPswrd= jest.spyOn(appMailerService,'resetPasswordMail').mockImplementation(()=>{return 'mail sent'});
      //outputs
      const expected = 'mail sent';
      //excecute
      const res = await service.resetPassword(email);
      //validation
      expect(res).toBe(expected);
      expect(spyFBEmail).toHaveBeenCalled();
      expect(spySign).toHaveBeenCalled();
      expect(spyResetPswrd).toHaveBeenCalled();
    });
    it('should return "mail sent" even on invalid email', async () => {
      //inputs
      const ImAToken = 'ey12345';
      const email="iamnotavalidemail@gmail.com";
      const user=user1;
      const spyFBEmail = jest.spyOn(usersService,'findByEmail').mockImplementation(()=>{return Promise.resolve(undefined)});
      const spySign = jest.spyOn(jwtService,'sign').mockImplementation(()=>ImAToken);
      const spyResetPswrd= jest.spyOn(appMailerService,'resetPasswordMail').mockImplementation(()=>{return 'mail sent'});
      //outputs
      const expected = 'mail sent';
      //excecute
      const res = await service.resetPassword(email);
      //validation
      expect(res).toBe(expected);
      expect(spyFBEmail).toHaveBeenCalled();
      expect(spySign).toHaveBeenCalled();
      expect(spyResetPswrd).toHaveBeenCalled();
    });
  });



  describe('verifyToken', () => {
    it('should be defined', () => {
      expect(service.verifyToken).toBeDefined();
    });
    it('should return BadRequestException on invalid token', async () => {
      //inputs
      const keyword = 'ey12345';
      const user=user1;
      //mocks implementations
      const spyVerify = jest.spyOn(jwtService,'verify').mockImplementation(()=> {return undefined as any});

      const spyFBEmail2 = jest.spyOn(usersService,'findByEmail').mockImplementation(()=>{return Promise.resolve(user)});
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.verifyToken(keyword, new Date('2020-07-02'));
      }
      catch(e){
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(spyVerify).toHaveBeenCalled();
      }
    });

    it('should return BadRequestException on invalid email', async () => {
      //inputs
      const keyword = 'ey12345';
      const tokenInfo={payload:{email:'notvalidemail',code:2111},data:''};
      const user=user1;
      //mocks implementations
      const spyVerify = jest.spyOn(jwtService,'verify').mockImplementation(()=> { return tokenInfo });

      const spyFBEmail = jest.spyOn(usersService,'findByEmail').mockImplementation(()=>{return Promise.resolve(undefined)});
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.verifyToken(keyword, new Date('2020-07-02'));
      }
      catch(e){
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(spyVerify).toHaveBeenCalled();
        expect(spyFBEmail).toHaveBeenCalled();
      }
    });
    it('should return BadRequestException on invalid code', async () => {
      //inputs
      const keyword = 'ey12345';
      const tokenInfo={payload:{email:'notvalidemail',code:1111},data:''};
      const user=user1;
      //mocks implementations
      const spyVerify = jest.spyOn(jwtService,'verify').mockImplementation(()=> { return tokenInfo });

      const spyFBEmail = jest.spyOn(usersService,'findByEmail').mockImplementation(()=>{return Promise.resolve(user)});
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.verifyToken(keyword, new Date('2020-07-02'));
      }
      catch(e){
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(spyVerify).toHaveBeenCalled();
        expect(spyFBEmail).toHaveBeenCalled();
      }
    });

    it('should return a object with properties message and email ', async () => {
      //inputs
      const keyword = 'ey12345';
      const tokenInfo={payload:{email:'notvalidemail',code:2030},data:''};
      const user=user1;
      //mocks implementations
      const spyVerify = jest.spyOn(jwtService,'verify').mockImplementation(()=> { return tokenInfo });

      const spyFBEmail = jest.spyOn(usersService,'findByEmail').mockImplementation(()=>{return Promise.resolve(user)});
      //outputs
      const expected = {message: `Valid token, now you can send the new password!`, email: `rigoomartinez@gmail.com` }
      //excecute
      const res = await service.verifyToken(keyword, new Date('2020-07-02'));
      
      //validation
      expect(res.message).toEqual(expected.message);
      expect(res.email).toEqual(expected.email);
      expect(spyVerify).toHaveBeenCalled();
      expect(spyFBEmail).toHaveBeenCalled();
    });
  });

});
