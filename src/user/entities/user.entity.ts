import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

import { TitleUserProgress } from '../../title/entities/title-user-progress.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @OneToMany(() => TitleUserProgress, (title) => title.user, { cascade: ["insert", "update"], eager: true })
  titles: TitleUserProgress[]
}
