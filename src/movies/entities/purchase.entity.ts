import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Movie } from '../../movies/entities/movie.entity';
  
  
/* istanbul ignore file */

  @Entity()
  export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({ type: 'timestamp', select: false})
    createdAt: Date;
  
    @ManyToOne((type) => User, (user) => user.purchases)
    user: User;
  
    @ManyToOne((type) => Movie, (movie) => movie.purchases)
    movie: Movie;
  }
  