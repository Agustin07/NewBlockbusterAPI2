import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';
import { Rental } from '../../movies/entities/rental.entity';
import { Purchase } from '../../movies/entities/purchase.entity';

/* istanbul ignore file */

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true, select: false })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', select: false, nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false, nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false, nullable: true })
  deletedAt: Date;

  @ManyToOne((type) => Role, (role) => role.users)
  role: Role;

  @OneToMany((type) => Rental, (rental) => rental.user)
  rentals: Rental[];

  @OneToMany((type) => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
