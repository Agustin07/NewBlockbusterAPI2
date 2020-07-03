import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Rental } from './entities/rental.entity';
import { Tag } from './entities/tag.entity';
import { Movie } from './entities/movie.entity';
import { RentalService } from './rental.service';
import { UsersModule } from '../users/users.module';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.entity';
import { AppMailerService } from '../appmailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Rental, Movie, Tag, Purchase]),
    UsersModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService, RentalService, PurchaseService,AppMailerService],
})
export class MoviesModule {}
