import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from './movie.entity';

/* istanbul ignore file */

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', select: false})
  createdAt: Date;

  @Column({default: false})
  returned: boolean;

  @ManyToOne((type) => User, (user) => user.rentals)
  user: User;

  @ManyToOne((type) => Movie, (movie) => movie.rentals)
  movie: Movie;
}
