import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { writeFile } from 'fs/promises';

import { FileFormat, Resource } from './entities/resource.entity';

export enum FilePath {
  AUDIO = './audio/'
}

@Injectable()
export class ResourceService {
    constructor (
      @InjectRepository(Resource)
      private resourceRepository: Repository<Resource>,
  ) {}

  saveAudio = async (audioContent) => {

    console.log(audioContent)
   // TODO move to enum 

   const savedFile = await this.resourceRepository.save({ 
       filePath: FilePath.AUDIO,
       fileFormat: FileFormat.MP3
   })

   await writeFile(FilePath.AUDIO + savedFile.id + '.' + FileFormat.MP3, audioContent) 

   return savedFile.id
  }
}
