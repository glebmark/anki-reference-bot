import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const TextToSpeech = require('@google-cloud/text-to-speech');

import { FileFormat } from '../resource/entities/resource.entity';
import { LanguageType, Title } from '../bot/entities/title.entity';
import { ResourceService } from '../resource/resource.service';
import { Definition } from '../bot/entities/definition.entity';
import { Example } from '../bot/entities/example.entity';

const voiceSettings = { 
        languageCode: 'en-US', 
        name: "en-US-Wavenet-J" 
    }
    
export interface Word {
    id: number;
    audioId: string;
    title: string;
    transcription: string;
    partOfSpeech: string;
    languageType: LanguageType;
    definitions: {
        id: number;
        audioId: string;
        definition: string;
        examples: {
            id: number;
            audioId: string;
            example: string;
        }[];
    }[];
  }

@Injectable()
export class SpeechService {

    constructor (
        private resourceService: ResourceService,
        @InjectRepository(Title)
        private titleRepository: Repository<Title>,
        @InjectRepository(Definition)
        private definitionRepository: Repository<Definition>,
        @InjectRepository(Example)
        private exampleRepository: Repository<Example>,
    ) {}

    downloadSpeechAndSave = async (titles: Word[]) => {
        const googleClient = new TextToSpeech.TextToSpeechClient();
  
        // TODO refactor to make more optimal connections to DB
        
        await Promise.all(titles.map(async ({ id: titleId, title, definitions, }) => {

            const request = {
              input: { text: title },
              voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
              audioConfig: { audioEncoding: FileFormat.MP3.toUpperCase() },
            };
    
            const [response] = await googleClient.synthesizeSpeech(request);

            const fileUuidForTitle = await this.resourceService.saveAudio(response.audioContent)

            await this.titleRepository.update(
                {
                    id: titleId
                }, 
                {
                    audioId: fileUuidForTitle
                })
            
            await Promise.all(definitions.map(async ({ id: definitionId, definition, examples }) => {

                const request = {
                    input: { text: definition },
                    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
                    audioConfig: { audioEncoding: FileFormat.MP3.toUpperCase() },
                  };
          
                  const [response] = await googleClient.synthesizeSpeech(request);
      
                  const fileUuidForDefinition = await this.resourceService.saveAudio(response.audioContent)
      
                  await this.definitionRepository.update(
                      {
                          id: definitionId
                      }, 
                      {
                          audioId: fileUuidForDefinition
                      })

                await Promise.all(examples.map(async ({ id: exampleId, example}) => {

                    const request = {
                        input: { text: example },
                        voice: voiceSettings,
                        audioConfig: { audioEncoding: FileFormat.MP3.toUpperCase() },
                      };
              
                      const [response] = await googleClient.synthesizeSpeech(request);
          
                      const fileUuidForExample = await this.resourceService.saveAudio(response.audioContent)
          
                      await this.exampleRepository.update(
                          {
                              id: exampleId
                          }, 
                          {
                              audioId: fileUuidForExample
                          })
                }))

            }))
        }))

    }

    getSpeech = async (titles: Word[]) => {
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
