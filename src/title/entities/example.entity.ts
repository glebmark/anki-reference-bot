import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { Definition } from './definition.entity';
import { Resource } from '../../resource/entities/resource.entity';

@Entity()
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  definitionId: number;

  @ManyToOne(() => Definition, (definition) => definition.examples)
  @JoinColumn({ name: 'definitionId' })
  definition: Definition

  @Column({
    type: 'text',
    nullable: true,
  })
  example: string;

  @Column({
    nullable: true
  })
  audioId: string;

  @OneToOne(() => Resource)
  @JoinColumn({ name: 'audioId' })
  audio: Resource;
}
