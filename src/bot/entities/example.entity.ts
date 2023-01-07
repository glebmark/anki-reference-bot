import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Definition } from './definition.entity';

@Entity()
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Definition, (definition) => definition.examples)
  definition: Definition

  @Column({
    type: 'text',
    nullable: true,
  })
  example: string;
}
