import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {
  movie1,
  movie2,
  movie3,
  createMovieDto,
  tag1,
  tagDto1,
  movie4,
} from './mocks/movies.mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RentalServiceFake } from './mocks/rental.service.mocks';
import { RentalService } from './rental.service';
import UsersService from '../users/users.service';
import { UsersServiceFake } from '../users/mocks/users.service.mocks';
import { user1 } from '../users/mocks/users.mocks';
import { Rental } from './entities/rental.entity';
import { PurchaseService } from './purchase.service';
import { PurchaseServiceFake } from './mocks/purchase.service.mocks';
import { AppMailerService } from '../appmailer.service';

const mock_appMailerService = {
  purchaseMail: jest.fn(),
  rentMail: jest.fn(),
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repoMovies: Repository<Movie>;
  let repoTags: Repository<Tag>;
  let rentalService: RentalService;
  let purchaseService: PurchaseService;
  let usersService: UsersService;
  let appMailerService: AppMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: RentalService, useValue: RentalServiceFake },
        { provide: UsersService, useValue: UsersServiceFake },
        { provide: PurchaseService, useValue: PurchaseServiceFake },
        { provide: AppMailerService, useValue: mock_appMailerService },
        { provide: getRepositoryToken(Movie), useClass: Repository },
        { provide: getRepositoryToken(Tag), useClass: Repository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    rentalService = module.get<RentalService>(RentalService);
    purchaseService = module.get<PurchaseService>(PurchaseService);
    usersService = module.get<UsersService>(UsersService);
    repoMovies = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    repoTags = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    appMailerService = module.get<AppMailerService>(AppMailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByIdOrThrow', () => {
    it('should return a movie by id', async () => {
      //inputs
      const movie = movie3;
      //mocks implementations
      const spyfindOneById = jest
        .spyOn(service, 'findOneById')
        .mockImplementation(() => Promise.resolve(movie));
      //outputs
      const expected = movie3;
      //excecute
      const res = await service.findOneByIdOrThrow(movie.id);
      //validation
      expect(res).toEqual(movie3);
      expect(spyfindOneById).toHaveBeenCalled();
    });
    it('should thow NotFoundException', async () => {
      const movie = movie3;
      const spyfindOneById = jest
        .spyOn(service, 'findOneById')
        .mockImplementation(() => Promise.resolve(undefined));
      try {
        const res = await service.findOneByIdOrThrow(5);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createOne', () => {
    it('should be defined', () => {
      expect(service.createOne).toBeDefined();
    });
    it('calls in createOne', async () => {
      const moviedto = createMovieDto;
      const spycreate = jest
        .spyOn(repoMovies, 'create')
        .mockImplementation(() => {
          return movie3;
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie3);
      });
      const res = await service.createOne(moviedto);
      expect(res).toBe(movie3);
      expect(spycreate).toHaveBeenCalled();
      expect(spysave).toHaveBeenCalled();
    });
  });

  describe('removeOne', () => {
    it('should be defined', () => {
      expect(service.removeOne).toBeDefined();
    });
    it('calls in removeOne', async () => {
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie3);
        });
      const spycreate = jest
        .spyOn(repoMovies, 'create')
        .mockImplementation(() => {
          return movie3;
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie3);
      });
      const res = await service.removeOne(3);
      expect(res).toBe(null);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should be defined', () => {
      expect(service.updateOne).toBeDefined();
    });
    it('calls in updateOne', async () => {
      const updateMovie = createMovieDto;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie3);
        });
      const spycreate = jest
        .spyOn(repoMovies, 'create')
        .mockImplementation(() => {
          return movie3;
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie3);
      });
      const res = await service.updateOne(3, updateMovie);
      expect(res).toBe(movie3);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('findTagOrThrow', () => {
    it('should be defined', () => {
      expect(service.findTagOrThrow).toBeDefined();
    });
    it('calls in findTagOrThrow', async () => {
      const name = 'COMEDY';
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(tag1);
        });
      const res = await service.findTagOrThrow(name);
      expect(res).toBe(tag1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const name = 'COMEDY';
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.findTagOrThrow(name);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('addTag', () => {
    it('should be defined', () => {
      expect(service.addTag).toBeDefined();
    });
    it('calls in addTag when tag exists', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(tag1);
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie);
      });
      const res = await service.addTag(movie.id, tagData);
      expect(res).toBe(movie);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });

    it('calls in addTag when the tag is new', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });

      const spycreate = jest
        .spyOn(repoTags, 'create')
        .mockImplementation(() => {
          return tag1;
        });
      const spysaveT = jest.spyOn(repoTags, 'save').mockImplementation(() => {
        return Promise.resolve(tag1);
      });

      const spysaveM = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie);
      });
      const res = await service.addTag(movie.id, tagData);
      expect(res).toBe(movie);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysaveT).toHaveBeenCalledTimes(1);
      expect(spysaveM).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTag', () => {
    it('should be defined', () => {
      expect(service.deleteTag).toBeDefined();
    });
    it('calls in deleteTag when tag exists', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(tag1);
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie);
      });
      const res = await service.deleteTag(movie.id, tagData);
      expect(res).toBe(movie);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });

    it('throw NotFoundException when the tag does not exist', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.deleteTag(movie.id, tagData);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('takeOne', () => {
    it('takeOne should be defined', () => {
      expect(service.takeOne).toBeDefined();
    });
    it('should returns movie1 with {stock:4, availability: true}', async () => {
      //inputs
      const movie = movie1;
      //mocks implementations
      //outputs
      const expected = { stock: 4, availability: true };
      //excecute
      const res = service.takeOne(movie);
      //validation
      expect(res.stock).toEqual(expected.stock);
      expect(res.availability).toEqual(expected.availability);
    });
    it('should returns movie1 with {stock:0, availability: false}', async () => {
      //inputs
      const movie = movie2;
      //mocks implementations
      //outputs
      const expected = { stock: 0, availability: false };
      //excecute
      const res = service.takeOne(movie);
      //validation
      expect(res.stock).toEqual(expected.stock);
      expect(res.availability).toEqual(expected.availability);
    });
    it('should throw NotFoundException because movie3 { availability= false}', async () => {
      //inputs
      const movie = movie3;
      //mocks implementations
      //outputs
      const expected = NotFoundException;
      //excecute
      try {
        const res = service.takeOne(movie);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(e).toEqual(Error(`Sorry, movie ${movie.title} not available.`));
      }
    });
    it('should throw NotFoundException because movie4 {sotck = 0}', async () => {
      //inputs
      const movie = movie4;
      //mocks implementations
      //outputs
      const expected = NotFoundException;
      //excecute
      try {
        const res = service.takeOne(movie);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(e).toEqual(Error(`Sorry, movie ${movie.title} sold out.`));
      }
    });
  });

  describe('returnOne', () => {
    it('returnOne should be defined', () => {
      expect(service.returnOne).toBeDefined();
    });
    it('should return movie1 with { stock: 5,availability: true}', () => {
      //inputs
      const movie = movie1;
      //mocks implementations
      //outputs
      const expected = { stock: 5, availability: true };
      //excecute
      const res = service.returnOne(movie);
      //validation
      expect(res.stock).toEqual(expected.stock);
      expect(res.availability).toEqual(expected.availability);
    });
    it('should return movie4 with stock: 1, availability: true ', () => {
      //inputs
      const movie = movie4;
      //mocks implementations
      //outputs
      const expected = { stock: 1, availability: true };
      //excecute
      const res = service.returnOne(movie);
      //validation
      expect(res.stock).toEqual(expected.stock);
      expect(res.availability).toEqual(expected.availability);
    });
  });

  describe('returnMovie', () => {
    it('returnMovie should be defined', () => {
      expect(service.returnMovie).toBeDefined();
    });
    it('should return message', async () => {
      //inputs
      const movieId = movie1.id;
      const userId = user1.id;
      const rental: Rental = {
        id: 1,
        movie: movie1,
        user: user1,
        returned: false,
        createdAt: new Date('2020-06.25'),
      };
      //mocks implementations
      const spyfindRentalOrThrow = jest
        .spyOn(rentalService, 'findRentalOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(rental);
        });
      const spySave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(rental.movie);
      });
      const spyUpdateReturned = jest
        .spyOn(rentalService, 'updateReturned')
        .mockImplementation(() => {
          return Promise.resolve(rental);
        });
      //outputs
      const expected = `"${rental.movie.title}" have been returned!`;
      //excecute
      const res = await service.returnMovie(movieId, userId);
      //validation
      expect(res).toEqual(expected);
    });
  });

  describe('getListOfMovies', () => {
    it('getListOfMovies should be defined', () => {
      expect(service.getListOfMovies).toBeDefined();
    });
    it('On one id, should return one movie', async () => {
      //inputs
      const ids = 1;
      const movies = movie1;
      //mocks implementations
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      //outputs
      const expected = movies;
      //excecute
      const res = await service.getListOfMovies(ids);
      //validation
      expect(res).toEqual(expected);
    });

    it('On array of ids, should return array of movie', async () => {
      //inputs
      const ids = [1, 2];
      const movies = [movie1, movie2];
      //mocks implementations
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie1);
        });
      //outputs
      const expected = [movie1, movie1];
      //excecute
      const res = await service.getListOfMovies(ids);
      //validation
      expect(res).toEqual(expected);
    });
  });

  describe('rentMovies', () => {
    it('rentMovies should be defined', () => {
      expect(service.rentMovies).toBeDefined();
    });
    it('On one id, should return one movie', async () => {
      //inputs
      const list = movie1.id;
      const userId = user1.id;
      const movies = movie1;
      const user = user1;
      //mocks implementations
      const spygetListOfMovies = jest
        .spyOn(service, 'getListOfMovies')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spygetUser = jest
        .spyOn(usersService, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyCreateRent = jest
        .spyOn(rentalService, 'createRent')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      const spyupdateOneOrMore = jest
        .spyOn(service, 'updateOneOrMore')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spyrentMail = jest
        .spyOn(appMailerService, 'rentMail')
        .mockImplementation(() => {
          return 'mail sent';
        });

      //outputs
      const expected = movies;
      //excecute
      const res = await service.rentMovies(list, userId);
      //validation
      expect(res).toEqual(expected);
      expect(spygetListOfMovies).toHaveBeenCalled();
      expect(spygetUser).toHaveBeenCalled();
      expect(spyCreateRent).toHaveBeenCalled();
      expect(spyupdateOneOrMore).toHaveBeenCalled();
      expect(spyrentMail).toHaveBeenCalled();
    });

    it('On array of ids, should return array of movie', async () => {
      //inputs
      const list = [1, 2];
      const userId = user1.id;
      const movies = [movie1, movie2];
      const user = user1;
      //mocks implementations
      const spygetListOfMovies = jest
        .spyOn(service, 'getListOfMovies')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spygetUser = jest
        .spyOn(usersService, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyCreateRent = jest
        .spyOn(rentalService, 'createRent')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      const spyupdateOneOrMore = jest
        .spyOn(service, 'updateOneOrMore')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spyrentMail = jest
        .spyOn(appMailerService, 'rentMail')
        .mockImplementation(() => {
          return 'mail sent';
        });
      //outputs
      const expected = movies;
      //excecute
      const res = await service.rentMovies(list, userId);
      //validation
      expect(res).toEqual(expected);
      expect(spygetListOfMovies).toHaveBeenCalled();
      expect(spygetUser).toHaveBeenCalled();
      expect(spyCreateRent).toHaveBeenCalled();
      expect(spyupdateOneOrMore).toHaveBeenCalled();
      expect(spyrentMail).toHaveBeenCalled();
    });

    it('should throw BadRequestException', async () => {
      //inputs
      const list = [1, 2];
      const userId = user1.id;
      const movies = [movie1, movie2];
      const user = user1;
      //mocks implementations
      const spygetListOfMovies = jest
        .spyOn(service, 'getListOfMovies')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spygetUser = jest
        .spyOn(usersService, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyCreateRent = jest
        .spyOn(rentalService, 'createRent')
        .mockImplementation(() => {
          return Promise.resolve(false);
        });
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.rentMovies(list, userId);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(e).toEqual(Error('Could not create rentals'));
      }
    });
  });

  describe('buyMovies', () => {
    it('buyMovies should be defined', () => {
      expect(service.buyMovies).toBeDefined();
    });
    it('On one id, should return one movie', async () => {
      //inputs
      const list = movie1.id;
      const userId = user1.id;
      const movies = movie1;
      const user = user1;
      //mocks implementations
      const spygetListOfMovies = jest
        .spyOn(service, 'getListOfMovies')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spygetUser = jest
        .spyOn(usersService, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyCreatePurchase = jest
        .spyOn(purchaseService, 'createPurchase')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      const spyupdateOneOrMore = jest
        .spyOn(service, 'updateOneOrMore')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spypurchaseMail = jest
        .spyOn(appMailerService, 'purchaseMail')
        .mockImplementation(() => {
          return 'mail sent';
        });

      //outputs
      const expected = movies;
      //excecute
      const res = await service.buyMovies(list, userId);
      //validation
      expect(res).toEqual(expected);
      expect(spygetListOfMovies).toHaveBeenCalled();
      expect(spygetUser).toHaveBeenCalled();
      expect(spyCreatePurchase).toHaveBeenCalled();
      expect(spyupdateOneOrMore).toHaveBeenCalled();
      expect(spypurchaseMail).toHaveBeenCalled();
    });

    it('On array of ids, should return array of movie', async () => {
      //inputs
      const list = [1, 2];
      const userId = user1.id;
      const movies = [movie1, movie2];
      const user = user1;
      //mocks implementations
      const spygetListOfMovies = jest
        .spyOn(service, 'getListOfMovies')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spygetUser = jest
        .spyOn(usersService, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyCreatePurchase = jest
        .spyOn(purchaseService, 'createPurchase')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });
      const spyupdateOneOrMore = jest
        .spyOn(service, 'updateOneOrMore')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spypurchaseMail = jest
        .spyOn(appMailerService, 'purchaseMail')
        .mockImplementation(() => {
          return 'mail sent';
        });
      //outputs
      const expected = movies;
      //excecute
      const res = await service.buyMovies(list, userId);
      //validation
      expect(res).toEqual(expected);
      expect(spygetListOfMovies).toHaveBeenCalled();
      expect(spygetUser).toHaveBeenCalled();
      expect(spyCreatePurchase).toHaveBeenCalled();
      expect(spyupdateOneOrMore).toHaveBeenCalled();
      expect(spypurchaseMail).toHaveBeenCalled();
    });

    it('should throw BadRequestException', async () => {
      //inputs
      const list = [1, 2];
      const userId = user1.id;
      const movies = [movie1, movie2];
      const user = user1;
      //mocks implementations
      const spygetListOfMovies = jest
        .spyOn(service, 'getListOfMovies')
        .mockImplementation(() => {
          return Promise.resolve(movies);
        });
      const spygetUser = jest
        .spyOn(usersService, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spyCreatePurchase = jest
        .spyOn(purchaseService, 'createPurchase')
        .mockImplementation(() => {
          return Promise.resolve(false);
        });
      //outputs
      const expected = BadRequestException;
      //excecute
      try {
        const res = await service.buyMovies(list, userId);
      } catch (e) {
        //validation
        expect(e).toBeInstanceOf(expected);
        expect(e).toEqual(Error('Could not create purchases'));
      }
    });
  });
});
