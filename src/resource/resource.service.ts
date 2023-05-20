import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { writeFile, readFile } from 'fs/promises';
import { Readable } from 'typeorm/platform/PlatformTools';

import { FileFormat, FilePath, Resource } from './entities/resource.entity';

@Injectable()
export class ResourceService {
    constructor (
      @InjectRepository(Resource)
      private resourceRepository: Repository<Resource>,
  ) {}

  saveAudio = async (audioContent: string | Uint8Array) => {

  // TODO move storage from local to AWS S3

   const savedFile = await this.resourceRepository.save({ 
       filePath: FilePath.AUDIO,
       fileFormat: FileFormat.MP3
   })

   await writeFile(FilePath.AUDIO + savedFile.id + '.' + FileFormat.MP3, audioContent) 

   return savedFile.id
  }

  async getFileDataStreamById(uuid: string) {

    console.log('uuid:')
    console.log(uuid)

    const resource: Buffer = await readFile(FilePath.AUDIO + uuid + '.' + FileFormat.MP3) 

    // console.log('resource:')
    // console.log(resource)

    const stream = new Readable();

    if (resource) {
      stream.push(resource);
    }

    stream.push(null);

    return stream;
  }
}
