import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Example } from './example.entity';
import { Title } from './title.entity';

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

  @OneToMany(() => Example, (example) => example.definition, { cascade: ["insert", "update"], eager: true })
  examples: Example[]
}
