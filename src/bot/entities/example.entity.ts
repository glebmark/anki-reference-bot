import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Definition } from './definition.entity';

@Entity()
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  definitionId: number;

  @ManyToOne(() => Definition)
  @JoinColumn({ name: 'definitionId' })
  definition: Definition;

  @Column({
    type: 'text',
    nullable: true,
  })
  example: string;
}
