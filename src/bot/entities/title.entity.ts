import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';

import { Definition } from './definition.entity';
import { Resource } from '../../resource/entities/resource.entity';

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
    unique: true,
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

  @OneToMany(() => Definition, (definition) => definition.title, { cascade: ["insert", "update"]})
  definitions: Definition[]

  @Column({
    nullable: true
  })
  audioId: number;

  @OneToOne(() => Resource)
  @JoinColumn({ name: 'audioId' })
  audio: Resource;
}
