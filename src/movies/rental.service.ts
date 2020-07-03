import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto, UpdateMovieDto, CreateTagDto } from './dto/movie.dto';
import { Tag } from './entities/tag.entity';
import { Rental } from './entities/rental.entity';
import { User } from 'src/users/entities/user.entity';
import { Purchase } from './entities/purchase.entity';

@Injectable()
export class RentalService {
  public constructor(
    @InjectRepository(Movie)
    private readonly repoMovies: Repository<Movie>,
    @InjectRepository(Tag)
    private readonly repoTags: Repository<Tag>,
    @InjectRepository(Rental)
    private readonly repoRentals: Repository<Rental>,
  ) {}

  async findRentalOrThrow(movieId: number, userId: number) {
    const rental = await this.findRental(movieId, userId);
    if (!rental) {
      throw new NotFoundException('No rent found for this movie.');
    }
    return rental;
  }

  /* istanbul ignore next */
  async findRental(movieId: number, userId: number) {
    const rental = await this.repoRentals
      .createQueryBuilder('rental')
      .where('rental.returned = :returned', { returned: false })
      .innerJoinAndSelect('rental.movie', 'movie', 'movie.id = :movieId', {
        movieId: movieId,
      })
      .addSelect('movie.stock')
      .addSelect('movie.availability')
      .innerJoinAndSelect('rental.user', 'user', 'user.id = :userId', {
        userId: userId,
      })
      .getOne();
    return rental;
  }

  async updateReturned(rental: Rental) {
    const updatedRental = this.repoRentals.create({
      ...rental,
      returned: true,
    });
    return await this.repoRentals.save(updatedRental);
  }

  async saveOne(movie: Movie, user: User) {
    const rental = this.repoRentals.create({
      movie: movie,
      user: user,
      returned: false,
    });
    const newRental = await this.repoRentals.save(rental);
    return true;
  }

  async createRent(movies: Movie | Movie[], user: User) {
    if (!Array.isArray(movies)) return await this.saveOne(movies, user);

    movies.forEach((movie) => {
      return this.saveOne(movie, user);
    });
    return true;
  }
}
