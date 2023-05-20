import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum FileFormat {
  MP3 = 'mp3'
}

@Entity()
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FileFormat,
    enumName: 'file_format_enum',
    nullable: true,
  })
  fileFormat: FileFormat;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;
}
