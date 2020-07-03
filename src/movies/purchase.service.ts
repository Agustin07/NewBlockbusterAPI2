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
export class PurchaseService {
  public constructor(
    @InjectRepository(Purchase)
    private readonly repoPurchases: Repository<Purchase>,
  ) {}

  async findPurchaseOrThrow(movieId: number, userId: number) {
    const purchase = await this.findPurchase(movieId, userId);
    if (!purchase) {
      throw new NotFoundException('Movie not found.');
    }
    return purchase;
  }

  async findPurchase(movieId: number, userId: number) {
    const purchase = await this.repoPurchases
      .createQueryBuilder('purchase')
      .innerJoinAndSelect('purchase.movie', 'movie', 'movie.id = :movieId', {
        movieId: movieId,
      })
      .addSelect('movie.stock')
      .addSelect('movie.availability')
      .innerJoin('purchase.user', 'user', 'user.id = :userId', {
        userId: userId,
      })
      .getOne();
    return purchase;
  }

  async saveOne(movie: Movie, user: User) {
    const purchase = this.repoPurchases.create({
      movie: movie,
      user: user,
    });
    const newPurchase = await this.repoPurchases.save(purchase);
    return true;
  }

  async createPurchase(movies: Movie | Movie[], user: User) {
    if (!Array.isArray(movies)) return await this.saveOne(movies, user);

    movies.forEach((movie) => {
      return this.saveOne(movie, user);
    });
    return true;
  }
}
