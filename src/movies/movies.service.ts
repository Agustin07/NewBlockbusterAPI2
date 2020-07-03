import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMovieDto,
  UpdateMovieDto,
  CreateTagDto,
  QueryMoviesDto,
} from './dto/movie.dto';
import { Tag } from './entities/tag.entity';
import { RentalService } from './rental.service';
import UsersService from '../users/users.service';

import { PurchaseService } from './purchase.service';
import {
  BuilderDirector,
  clientSearchQuery,
  SeachQuery,
} from './builder/search.builder';
import { AppMailerService } from '../appmailer.service';

@Injectable()
export class MoviesService {
  public constructor(
    @InjectRepository(Movie)
    private readonly repoMovies: Repository<Movie>,
    @InjectRepository(Tag)
    private readonly repoTags: Repository<Tag>,
    private rentalService: RentalService,
    private purchaseService: PurchaseService,
    private usersService: UsersService,
    private readonly appmailerService: AppMailerService,
  ) {}

  async getMovies(query: QueryMoviesDto) {
    const director = new BuilderDirector();

    const search: SeachQuery = clientSearchQuery(director, query);

    if (search.tags.length > 0) {
      const movies = await this.repoMovies
        .createQueryBuilder('movie')
        .addSelect('movie.likes')
        .addSelect('movie.price')
        .addSelect('movie.availability')
        .addSelect('movie.stock')
        .where('movie.isActive = :isActive', { isActive: true })
        .andWhere('movie.title like :title', { title: search.title })
        .andWhere('movie.availability = :availability', {
          availability: search.availability,
        })
        .leftJoinAndSelect('movie.tags', 'tag')
        .andWhere('tag.name IN (:...tags)', { tags: search.tags })
        .orderBy(
          'movie.' + search.sortedBy,
          search.sortedBy !== 'title' ? 'DESC' : 'ASC',
        )
        .getMany();
      return movies;
    } else {
      const movies = await this.repoMovies
        .createQueryBuilder('movie')
        .addSelect('movie.likes')
        .addSelect('movie.price')
        .addSelect('movie.availability')
        .addSelect('movie.stock')
        .where('movie.isActive = :isActive', { isActive: true })
        .andWhere('movie.title like :title', { title: search.title })
        .andWhere('movie.availability = :availability', {
          availability: search.availability,
        })
        .leftJoinAndSelect('movie.tags', 'tag')
        .orderBy(
          'movie.' + search.sortedBy,
          search.sortedBy !== 'title' ? 'DESC' : 'ASC',
        )
        .getMany();
      return movies;
    }
  }

  async findOneById(id: number) {
    return await this.repoMovies
      .createQueryBuilder('movie')
      .addSelect('movie.stock')
      .addSelect('movie.availability')
      .addSelect('movie.price')
      .leftJoinAndSelect('movie.tags', 'tag')
      .where('movie.isActive = :isActive', { isActive: true })
      .andWhere('movie.id = :id', { id: id })
      .getOne();
  }

  async findOneByIdOrThrow(id: number) {
    const movie = await this.findOneById(id);
    if (!movie) {
      throw new NotFoundException('No movie found.');
    }
    return movie;
  }

  async createOne(data: CreateMovieDto) {
    const movie = this.repoMovies.create({ ...data });
    const createdMovie = await this.repoMovies.save(movie);
    return createdMovie;
  }

  public async removeOne(id: number) {
    const existingMovie = await this.findOneByIdOrThrow(id);
    const movie = this.repoMovies.create({
      ...existingMovie,
      isActive: false,
    });
    await this.repoMovies.save(movie);
    return null;
  }

  public async updateOne(id: number, data: UpdateMovieDto) {
    const { ...updateData } = data;
    const existingMovie = await this.findOneByIdOrThrow(id);
    const movie = this.repoMovies.create({
      ...existingMovie,
      ...updateData,
    });
    const updatedMovie = await this.repoMovies.save(movie);
    return updatedMovie;
  }

  async findTagOrThrow(name: string) {
    const tag = await this.repoTags.findOne({ where: { name: name } });
    if (!tag) {
      throw new NotFoundException('No tag found.');
    }
    return tag;
  }

  async addTag(id: number, data: CreateTagDto) {
    const existingMovie = await this.findOneByIdOrThrow(id);
    let tag = await this.repoTags.findOne({ where: { name: data.name } });
    if (!tag) {
      const newtag = this.repoTags.create({ ...data });
      tag = await this.repoTags.save(newtag);
    }
    existingMovie.tags = [...existingMovie.tags, tag];

    const movie = await this.repoMovies.save(existingMovie);
    return movie;
  }

  async deleteTag(id: number, data: CreateTagDto) {
    const movie = await this.findOneByIdOrThrow(id);
    const tagToRemove = await this.repoTags.findOne({
      where: { name: data.name },
    });
    if (!tagToRemove) {
      throw new NotFoundException('No tag found.');
    }

    movie.tags = movie.tags.filter((tag) => {
      return tag.id !== tagToRemove.id;
    });
    const updatedMovie = await this.repoMovies.save(movie);
    return updatedMovie;
  }

  takeOne(movie: Movie) {
    if (movie.stock === 0)
      throw new NotFoundException(`Sorry, movie ${movie.title} sold out.`);
    if (movie.availability === false)
      throw new NotFoundException(`Sorry, movie ${movie.title} not available.`);
    movie.stock--;
    if (movie.stock === 0) movie.availability = false;
    return movie;
  }

  returnOne(movie: Movie) {
    movie.stock++;
    if (movie.availability === false) movie.availability = true;
    return movie;
  }

  async returnMovie(movieId: number, userId: number) {
    const rental = await this.rentalService.findRentalOrThrow(movieId, userId);
    const returnedMovie = this.returnOne(rental.movie);
    const movie = await this.repoMovies.save(returnedMovie);
    await this.rentalService.updateReturned(rental);
    return `"${movie.title}" have been returned!`;
  }

  async getListOfMovies(ids: number | number[]) {
    if (!Array.isArray(ids))
      return this.takeOne(await this.findOneByIdOrThrow(ids));
    const moviesList = Promise.all(
      ids.map(async (id) => {
        let movie = await this.findOneByIdOrThrow(id);
        return this.takeOne(movie);
      }),
    ).then((result) => {
      return result;
    });
    return moviesList;
  }

  async updateOneOrMore(movies: Movie | Movie[]) {
    if (!Array.isArray(movies)) return await this.repoMovies.save(movies);
    const updatedMovies = Promise.all(
      movies.map(async (movie) => {
        return await this.repoMovies.save(movie);
      }),
    ).then((result) => {
      return result;
    });

    return updatedMovies;
  }

  async rentMovies(list: number | number[], userId: number) {
    const moviesList = await this.getListOfMovies(list);
    const user = await this.usersService.getUserByIdOrThrow(userId);
    if (!(await this.rentalService.createRent(moviesList, user)))
      throw new BadRequestException('Could not create rentals');

    const rentedMovies = await this.updateOneOrMore(moviesList);
    this.appmailerService.rentMail(user, rentedMovies);
    return rentedMovies;
  }

  async buyMovies(list: number | number[], userId: number) {
    const moviesList = await this.getListOfMovies(list);
    const user = await this.usersService.getUserByIdOrThrow(userId);
    if (!(await this.purchaseService.createPurchase(moviesList, user)))
      throw new BadRequestException('Could not create purchases');

    const purchasedMovies = await this.updateOneOrMore(moviesList);
    this.appmailerService.purchaseMail(user, purchasedMovies);
    return purchasedMovies;
  }

  async getRentedMovies(userId: number) {
    const rentals = await this.repoMovies
      .createQueryBuilder('movie')
      .innerJoin('movie.rentals', 'rental', 'rental.user = :userId', {
        userId: userId,
      })
      .addSelect('rental.createdAt')
      .addSelect('rental.returned')
      .getMany();
    return rentals;
  }

  async getPurchasedMovies(userId: number) {
    const rentals = await this.repoMovies
      .createQueryBuilder('movie')
      .innerJoin('movie.purchases', 'purchase', 'purchase.user = :userId', {
        userId: userId,
      })
      .getMany();
    return rentals;
  }
}
