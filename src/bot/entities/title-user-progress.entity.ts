import { BaseEntity, Column, Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Title } from './title.entity';

@Entity()
export class TitleUserProgress extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @PrimaryColumn()
  titleId: number;

  @ManyToOne(() => Title)
  @JoinColumn({ name: 'titleId' })
  title: Title;

  @Column({
    type: 'boolean',
    default: false,
  })
  isSavedToAnki: boolean;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;
}
