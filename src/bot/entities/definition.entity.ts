import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, PrimaryColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';

import { Example } from './example.entity';
import { Title } from './title.entity';
import { Resource } from '../../resource/entities/resource.entity';

@Entity()
export class Definition extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleId: number;

  @ManyToOne(() => Title, (title) => title.definitions)
  @JoinColumn({ name: 'titleId' })
  title: Title

  @Column({
    type: 'text',
    nullable: true,
  })
  definition: string;

  @OneToMany(() => Example, (example) => example.definition, { cascade: ["insert", "update"]})
  examples: Example[]

  @Column({
    nullable: true
  })
  audioId: string;

  @OneToOne(() => Resource)
  @JoinColumn({ name: 'audioId' })
  audio: Resource;
}
