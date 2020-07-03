import { Test, TestingModule } from '@nestjs/testing';
import { movie1, movie2, movie3 } from './mocks/movies.mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { user1 } from '../users/mocks/users.mocks';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.entity';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let repoPurchase: Repository<Purchase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: getRepositoryToken(Purchase), useClass: Repository },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);

    repoPurchase = module.get<Repository<Purchase>>(
      getRepositoryToken(Purchase),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPurchaseOrThrow', () => {
    it('should return one Purchase ', async () => {
      //inputs
      const movieId = 1;
      const userId = 2;
      const purchase: Purchase = {
        id: 1,
        movie: movie1,
        user: user1,
        createdAt: new Date('2020-07-02'),
      };
      //mocks implementations
      const spyfindPurchase = jest
        .spyOn(service, 'findPurchase')
        .mockImplementation(() => {
          return Promise.resolve(purchase);
        });
      //outputs
      const expected = purchase;
      //excecute
      const res = await service.findPurchaseOrThrow(movieId, userId);
      //validation
      expect(res).toEqual(expected);
      expect(spyfindPurchase).toHaveBeenCalled();
    });

    it('should throw BadRequestException ', async () => {
      //inputs
      const movieId = 1;
      const userId = 2;
      const purchase = undefined;
      //mocks implementations
      const spyfindPurchase = jest
        .spyOn(service, 'findPurchase')
        .mockImplementation(() => {
          return Promise.resolve(purchase);
        });
      //outputs
      const expected = NotFoundException;
      //excecute
      try {
        const res = await service.findPurchaseOrThrow(movieId, userId);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
      }
    });
  });

  describe('saveOne', () => {
    it('On save, should return boolean true ', async () => {
      //inputs
      const movie = movie1;
      const user = user1;
      const purchase: Purchase = {
        id: 1,
        movie: movie1,
        user: user1,
        createdAt: new Date('2020-07-02'),
      };
      //mocks implementations
      const spyCreate = jest
        .spyOn(repoPurchase, 'create')
        .mockImplementation(() => {
          return purchase;
        });
      const spySave = jest
        .spyOn(repoPurchase, 'save')
        .mockImplementation(() => {
          return Promise.resolve(purchase);
        });
      //outputs
      const expected = true;
      //excecute
      const res = await service.saveOne(movie, user);
      //validation
      expect(res).toEqual(expected);
      expect(spyCreate).toHaveBeenCalled();
      expect(spySave).toHaveBeenCalled();
    });
  });

  describe('createPurchase', () => {
    it('On create one purchase, should return boolean true ', async () => {
      //inputs
      const movies = movie1;
      const user = user1;
      //mocks implementations
      const spySaveOne = jest
        .spyOn(service, 'saveOne')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      //outputs
      const expected = true;
      //excecute
      const res = await service.createPurchase(movies, user);
      //validation
      expect(res).toEqual(expected);
      expect(spySaveOne).toHaveBeenCalled();
    });

    it('On create more than one purchase, should return boolean true ', async () => {
      //inputs
      const movies = [movie1, movie3];
      const user = user1;
      //mocks implementations
      const spySaveOne = jest
        .spyOn(service, 'saveOne')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      //outputs
      const expected = true;
      //excecute
      const res = await service.createPurchase(movies, user);
      //validation
      expect(res).toEqual(expected);
      expect(spySaveOne).toHaveBeenCalled();
    });
  });

  //end;
});
