import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


const TextToSpeech = require('@google-cloud/text-to-speech');

import { FileFormat, Resource } from '../resource/entities/resource.entity';
import { LanguageType } from '../bot/entities/title.entity';
import { ResourceService } from '../resource/resource.service';

export interface Word {
    title: string;
    transcription: string;
    partOfSpeech: string;
    languageType: LanguageType;
    definitions: {
        definition: string;
        examples: {
            example: string;
        }[];
    }[];
  }

@Injectable()
export class SpeechService {

    constructor (
        private resourceService: ResourceService,
    ) {}

    downloadSpeechAndSave = async (titles: Word[]) => {
        const googleClient = new TextToSpeech.TextToSpeechClient();
  
        await Promise.all(titles.map(async ({ title, definitions, }) => {

            const request = {
              input: { text: title },
              voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
              audioConfig: { audioEncoding: FileFormat.MP3.toUpperCase() },
            };

            // save filePath (its ok if it will be always same)
            // after saving filePath you will be able to get uuid and use it as file
            // then on getSpeech it will be possible to get file by combining filePath + uuid + FileFormat.MP3 (make field fileFormat)
    
            const [response] = await googleClient.synthesizeSpeech(request);

            const savedFile = await this.resourceService.saveAudio(response.audioContent)

            

            // TODO save in title id to file
            
        }))

    }

    getSpeech = async () => {
        const googleTTSClient = new TextToSpeech.TextToSpeechClient();
  
        const text = 'hello, world!';
  
        const request = {
          input: {text: text},
          voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
          audioConfig: {audioEncoding: 'MP3'},
        };
  
        const [response] = await googleTTSClient.synthesizeSpeech(request);

        const path = './audio/'

        const filename = 'output.mp3'

        console.log(response.audioContent)

        // await this.speechRepository.save({name: 'dsf'})
  
        
    }
}
