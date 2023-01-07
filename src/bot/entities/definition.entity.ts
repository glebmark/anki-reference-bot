import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Example } from './example.entity';
import { Title } from './title.entity';

@Entity()
export class Definition extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleId: number;

  @ManyToOne(() => Title)
  @JoinColumn({ name: 'titleId' })
  title: Title;

  @Column({
    type: 'text',
    nullable: true,
  })
  definition: string;

  @OneToMany(() => Example, (example) => example.definition)
  examples: Example[]
}
