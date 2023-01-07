import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Title extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
