import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from './rental.service';
import { movie2, movie3 } from './mocks/movies.mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Rental } from './entities/rental.entity';
import { user1 } from '../users/mocks/users.mocks';

describe('RentalService', () => {
  let service: RentalService;
  let repoMovies: Repository<Movie>;
  let repoTags: Repository<Tag>;
  let repoRentals: Repository<Rental>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        { provide: getRepositoryToken(Movie), useClass: Repository },
        { provide: getRepositoryToken(Tag), useClass: Repository },
        { provide: getRepositoryToken(Rental), useClass: Repository },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
    repoMovies = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    repoTags = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    repoRentals = module.get<Repository<Rental>>(getRepositoryToken(Rental));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findRentalOrThrow', () => {
    it('should be defined', () => {
      expect(service.findRentalOrThrow).toBeDefined();
    });
    it('calls in findRentalOrThrow', async () => {
      const user = user1;
      const movie = movie3;
      const expected: Rental = {
        id: 1,
        movie: movie3,
        user: user1,
        returned: true,
        createdAt: new Date('2020-06.25'),
      };
      const spyfindRental = jest
        .spyOn(service, 'findRental')
        .mockImplementation(() => {
          return Promise.resolve({
            id: 1,
            movie: movie3,
            user: user1,
            returned: true,
            createdAt: new Date('2020-06.25'),
          } as Rental);
        });

      const res = await service.findRentalOrThrow(movie.id, user.id);

      expect(res).toEqual(expected);
      expect(spyfindRental).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      const user = user1;
      const movie = movie3;
      const spyfindRental = jest
        .spyOn(service, 'findRental')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.findRentalOrThrow(movie.id, user.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(spyfindRental).toHaveBeenCalled();
      }
    });
  });

  describe('saveOne', () => {
    const user = user1;
    const movie = movie3;
    const rental: Rental = {
      id: 1,
      movie: movie3,
      user: user1,
      returned: true,
      createdAt: new Date('2020-06.25'),
    };

    it('should be defined', () => {
      expect(service.saveOne).toBeDefined();
    });
    it('on save, returns boolean true', async () => {
      const expected = true;
      const spyCreate = jest
        .spyOn(repoRentals, 'create')
        .mockImplementation(() => {
          return rental;
        });

      const spySave = jest.spyOn(repoRentals, 'save').mockImplementation(() => {
        return Promise.resolve(rental);
      });

      const res = await service.saveOne(movie, user);
      expect(res).toBe(expected);
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledTimes(1);
    });
  });

  describe('createRent', () => {
    const expected = true;
    const user = user1;

    it('should be defined', () => {
      expect(service.createRent).toBeDefined();
    });
    it('create one rent returns true', async () => {
      const movies = movie3;
      const spySaveOne = jest
        .spyOn(service, 'saveOne')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });

      const res = await service.createRent(movies, user);
      expect(res).toBe(expected);
      expect(spySaveOne).toHaveBeenCalledTimes(1);
    });
    it('create more than one rent returns true', async () => {
      const movies = [movie3, movie2];
      const spySaveOne = jest
        .spyOn(service, 'saveOne')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });

      const res = await service.createRent(movies, user);
      expect(res).toBe(expected);
      expect(spySaveOne).toHaveBeenCalledTimes(2);
    });
  });
});
