import { Movie } from '../entities/movie.entity';
import { movie1 } from './movies.mocks';

/* istanbul ignore file */

export const MoviesServiceFake = {
  getMovies: jest.fn(
    async (): Promise<Movie[]> => {
      return Promise.resolve([movie1]);
    },
  ),
  findOneByIdOrThrow: jest.fn(),
  createOne: jest.fn(),
  removeOne: jest.fn(),
  updateOne: jest.fn(),
  findTagOrThrow: jest.fn(),
  addTag: jest.fn(),
  deleteTag: jest.fn(),
  takeOne: jest.fn(),
  returnOne: jest.fn(),
  returnMovie: jest.fn(),
  getListOfMovies: jest.fn(),
  updateOneOrMore: jest.fn(),
  rentMovies: jest.fn(),
  buyMovies: jest.fn(),
  getRentedMovies: jest.fn(),
  getPurchasedMovies: jest.fn(),
};
/*    

createUser: jest.fn(async (data: CreateUserDto): Promise<Partial<User>> => {
        return Promise.resolve({ id:2, username:data.username,  email:data.email, role: {id:2, name:'CLIENT'} as Role });
      }),



    */
