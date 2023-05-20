import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'stream'

import { FileFormat, Resource } from './entities/resource.entity';

@Injectable()
export class ResourceService {
    constructor (
      @InjectRepository(Resource)
      private resourceRepository: Repository<Resource>,
  ) {}

  saveAudio = async (audioContent: string | Uint8Array) => {

   const savedFile = await this.resourceRepository.save({ 
       fileFormat: FileFormat.MP3
   })

   const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: savedFile.id,
    Body: audioContent,
  };

  const result = await new Upload({
    client: s3,
    params,
  }).done();

  // ensure file was uploaded
  const command = new HeadObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: savedFile.id,
  });

  try {
    await s3.send(command);
  } catch (err) {
    console.log('AWS S3 error:');
    console.error(err);
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      error: `File ${savedFile.id} haven\'t been uploaded to S3, error: ${err}`,
    });
  }
   return savedFile.id
  }

  async getReadableDataStreamById(uuid: string) {

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uuid,
    });
  
    let readableStream: Readable

    try {
      const response = await s3.send(command);
      readableStream = response.Body as Readable
    } catch (err) {
      console.log('AWS S3 GetObjectCommand error:');
      console.error(err);
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `File ${uuid} haven\'t been uploaded to S3, error: ${err}`,
      });
    }

    return readableStream
  }
}
