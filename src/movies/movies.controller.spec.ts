import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesServiceFake } from './mocks/movies.service.mocks';
import {
  movie1,
  movie2,
  createMovieDto,
  movie3,
  tagDto1,
} from './mocks/movies.mocks';
import { authUser } from '../users/mocks/users.mocks';

describe('Movies Controller', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: MoviesServiceFake }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return an array of movies ', async () => {
      const result = [movie1, movie2];
      const query = { sortedBy:'title', availability:'true', tags:'COMEDY',title:'' }
      const spygetMovies = jest
        .spyOn(moviesService, 'getMovies')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.getMovies(query)).toEqual(result);
      expect(spygetMovies).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMovie', () => {
    it('should return one movie ', async () => {
      const result = movie1;
      const spyfindOneByIdOrThrow = jest
        .spyOn(moviesService, 'findOneByIdOrThrow')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.getMovie(movie1.id)).toEqual(result);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMovie', () => {
    it('should return a new movie', async () => {
      const newMovieDto = createMovieDto;
      const spycreateOne = jest
        .spyOn(moviesService, 'createOne')
        .mockImplementation(() => Promise.resolve(movie3));
      expect(await controller.createMovie(newMovieDto)).toEqual(movie3);
      expect(spycreateOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateMovie', () => {
    it('should return a updated movie', async () => {
      const updateMovieDto = createMovieDto;
      const spyupdateOne = jest
        .spyOn(moviesService, 'updateOne')
        .mockImplementation(() => Promise.resolve(movie3));
      expect(await controller.updateMovie(movie3.id, updateMovieDto)).toEqual(
        movie3,
      );
      expect(spyupdateOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie, no return', async () => {
      const spyremoveOne = jest
        .spyOn(moviesService, 'removeOne')
        .mockImplementation(() => Promise.resolve(null));
      expect(await controller.deleteMovie(3)).toEqual(null);
      expect(spyremoveOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTag', () => {
    it('should return a movie with tag added', async () => {
      const movie = movie3;
      const createTag = tagDto1;
      const spyaddTag = jest
        .spyOn(moviesService, 'addTag')
        .mockImplementation(() => Promise.resolve(movie));
      const rest = await controller.addTag(movie.id, createTag);
      expect(rest.tags[0].name).toEqual(movie.tags[0].name);
      expect(spyaddTag).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTag', () => {
    it('should return a movie the tag deleted', async () => {
      const movie = movie3;
      const createTag = tagDto1;
      const spydeleteTag = jest
        .spyOn(moviesService, 'deleteTag')
        .mockImplementation(() => Promise.resolve(movie));
      const rest = await controller.deleteTag(movie.id, createTag);
      expect(rest).toEqual(movie);
      expect(spydeleteTag).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRentedMovies',()=>{
    it('should return array of movies', async () => {
      //inputs
      const user = authUser;
      const movies = [movie1,movie2,movie3];

      //mocks implementations
      const spyFunction = jest.spyOn(moviesService,'getRentedMovies').mockImplementation(()=>{return Promise.resolve(movies)});
      //outputs
      const expected = movies;
      //excecute
      const res = await controller.getRentedMovies(user);
      //validation
      expect(res).toEqual(expected);
      expect(spyFunction).toHaveBeenCalled();
    });
  });


  describe('getPurchasedMovies',()=>{
    it('should return array of movies', async () => {
      //inputs
      const user = authUser;
      const movies = [movie1,movie2,movie3];

      //mocks implementations
      const spyFunction = jest.spyOn(moviesService,'getPurchasedMovies').mockImplementation(()=>{return Promise.resolve(movies)});
      //outputs
      const expected = movies;
      //excecute
      const res = await controller.getPurchasedMovies(user);
      //validation
      expect(res).toEqual(expected);
      expect(spyFunction).toHaveBeenCalled();
    });
  });

  describe('returnMovie',()=>{
    it('should return message', async () => {
      //inputs
      const id = movie2.id;
      const user = authUser;
      //mocks implementations
      const spyFunction = jest.spyOn(moviesService,'returnMovie').mockImplementation(()=>{return Promise.resolve(`"${movie2.title}" have been returned!`)});
      //outputs
      const expected = `"${movie2.title}" have been returned!`;
      //excecute
      const res = await controller.returnMovie(id, user);
      //validation
      expect(res).toEqual(expected);
      expect(spyFunction).toHaveBeenCalled();
    });
  });


  describe('rentMovie',()=>{
    it('should return rented movies', async () => {
      //inputs
      const list = movie1.id;
      const user = authUser;
      const movies = movie1;
      //mocks implementations
      const spyFunction = jest.spyOn(moviesService,'rentMovies').mockImplementation(()=>{return Promise.resolve(movies)});
      //outputs
      const expected = movies;
      //excecute
      const res = await controller.rentMovie(list, user);
      //validation
      expect(res).toEqual(expected);
      expect(spyFunction).toHaveBeenCalled();
    });
  });

  describe('buyMovie',()=>{
    it('should return bought movies', async () => {
      //inputs
      const list = [movie1.id, movie2.id];
      const user = authUser;
      const movies = [movie1,movie2];
      //mocks implementations
      const spyFunction = jest.spyOn(moviesService,'rentMovies').mockImplementation(()=>{return Promise.resolve(movies)});
      //outputs
      const expected = movies;
      //excecute
      const res = await controller.rentMovie(list, user);
      //validation
      expect(res).toEqual(expected);
      expect(spyFunction).toHaveBeenCalled();
    });
  });

});
