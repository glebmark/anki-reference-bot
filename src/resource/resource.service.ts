import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { writeFile } from 'fs/promises';

import { FileFormat, FilePath, Resource } from './entities/resource.entity';

@Injectable()
export class ResourceService {
    constructor (
      @InjectRepository(Resource)
      private resourceRepository: Repository<Resource>,
  ) {}

  saveAudio = async (audioContent: string | Uint8Array) => {

   const savedFile = await this.resourceRepository.save({ 
       filePath: FilePath.AUDIO,
       fileFormat: FileFormat.MP3
   })

   await writeFile(FilePath.AUDIO + savedFile.id + '.' + FileFormat.MP3, audioContent) 

   return savedFile.id
  }
}
