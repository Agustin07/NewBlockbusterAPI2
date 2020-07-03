import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


/* istanbul ignore file */

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
