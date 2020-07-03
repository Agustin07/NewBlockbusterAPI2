import { Test, TestingModule } from '@nestjs/testing';
import { AppMailerService } from "./appmailer.service";
import { MailerService } from '@nestjs-modules/mailer';
import {movie1, movie2, movie3} from './movies/mocks/movies.mocks';
import { user1 } from './users/mocks/users.mocks';

const MailerServiceFake = {
    sendMail:jest.fn(),
}


describe('AppMailerService', () => {
    let service: AppMailerService;
    let mailerService: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [ AppMailerService,
          {
              provide: MailerService,
              useValue: MailerServiceFake,
          },]
        }).compile();

        service = module.get<AppMailerService>(AppMailerService);
        mailerService = module.get<MailerService>(MailerService);
      });

      it('AppMailerService should be defined', () => {
        expect(service).toBeDefined();
      });

      it('MailerService should be defined', () => {
        expect(mailerService).toBeDefined();
      });

      describe('purchaseMail',()=>{
        it('should be defined', () => {
          expect(service.purchaseMail).toBeDefined();
        });

        it('On one movie, should return "mail sent"', () => {
            //inputs
            const movies = movie1;
            const user = user1;
            //mocks implementations
            const spySendMail = jest.spyOn(mailerService,'sendMail').mockImplementation(()=>{return Promise.resolve()});
            //outputs
            const expected = 'mail sent';

            //excecute
            const res = service.purchaseMail(user, movies);
            //validation
            expect(res).toEqual(expected);
            expect(spySendMail).toHaveBeenCalled();
        });
        it('On more than one movie, should return "mail sent"', () => {
            //inputs
            const movies = [movie1, movie2, movie3];
            const user = user1;
            //mocks implementations
            const spySendMail = jest.spyOn(mailerService,'sendMail').mockImplementation(()=>{return Promise.resolve()});
            //outputs
            const expected = 'mail sent';

            //excecute
            const res = service.purchaseMail(user, movies);
            //validation
            expect(res).toEqual(expected);
            expect(spySendMail).toHaveBeenCalled();
        });
      });



      describe('rentMail',()=>{
        it('should be defined', () => {
          expect(service.rentMail).toBeDefined();
        });

        it('On one movie, should return "mail sent"', () => {
            //inputs
            const movies = movie1;
            const user = user1;
            //mocks implementations
            const spySendMail = jest.spyOn(mailerService,'sendMail').mockImplementation(()=>{return Promise.resolve()});
            //outputs
            const expected = 'mail sent';

            //excecute
            const res = service.rentMail(user, movies);
            //validation
            expect(res).toEqual(expected);
            expect(spySendMail).toHaveBeenCalled();
        });
        it('On more than one movie, should return "mail sent"', () => {
            //inputs
            const movies = [movie1, movie2, movie3];
            const user = user1;
            //mocks implementations
            const spySendMail = jest.spyOn(mailerService,'sendMail').mockImplementation(()=>{return Promise.resolve()});
            //outputs
            const expected = 'mail sent';

            //excecute
            const res = service.rentMail(user, movies);
            //validation
            expect(res).toEqual(expected);
            expect(spySendMail).toHaveBeenCalled();
        });
      });


      
      describe('resetPasswordMail',()=>{
        it('should be defined', () => {
          expect(service.resetPasswordMail).toBeDefined();
        });

        it('should return "mail sent"', () => {
            //inputs
            const keyword = 'ey12345';
            const email = 'rigoomartinez@gmail.com';
            //mocks implementations
            const spySendMail = jest.spyOn(mailerService,'sendMail').mockImplementation(()=>{return Promise.resolve()});
            //outputs
            const expected = 'mail sent';

            //excecute
            const res = service.resetPasswordMail(keyword, email);
            //validation
            expect(res).toEqual(expected);
            expect(spySendMail).toHaveBeenCalled();
        });
      });
});