import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Rental } from './rental.entity';
import { Purchase } from './purchase.entity';

/* istanbul ignore file */

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  poster: string;

  @Column({ select: false })
  stock: number;

  @Column()
  trailer: string;

  @Column('decimal', { precision: 5, scale: 2, select: false })
  price: number;

  @Column({ default: 0, select: false })
  likes: number;

  @Column({ select: false })
  availability: boolean;

  @Column({ default: true, select: false })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deletedAt: Date;

  @ManyToMany((type) => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany((type) => Rental, (rental) => rental.movie)
  rentals: Rental[];

  @OneToMany((type) => Purchase, (purchase) => purchase.movie)
  purchases: Purchase[];
}
