import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Definition } from './definition.entity';

export enum LanguageType {
  ENGLISH = 'eng',
  FRANCAIS = 'fr',
}

@Entity()
export class Title extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: LanguageType,
    enumName: 'language_type_enum',
    nullable: false,
  })
  languageType: LanguageType;

  @Column({
    type: 'text',
    nullable: true,
  })
  transcription: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  partOfSpeech: string;

  @OneToMany(() => Definition, (definition) => definition.title)
  titles: Definition[]
}
