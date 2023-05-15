import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import TextToSpeech from '@google-cloud/text-to-speech';

import { FileFormat } from '../resource/entities/resource.entity';
import { LanguageType, Title } from '../title/entities/title.entity';
import { ResourceService } from '../resource/resource.service';
import { Definition } from '../title/entities/definition.entity';
import { Example } from '../title/entities/example.entity';

const voiceSettings = { 
        languageCode: 'en-US', 
        name: "en-US-Wavenet-J" 
    }

    enum SsmlVoiceGender {
        SSML_VOICE_GENDER_UNSPECIFIED = 0,
        MALE = 1,
        FEMALE = 2,
        NEUTRAL = 3
    }
    
    enum AudioEncoding {
        AUDIO_ENCODING_UNSPECIFIED = 0,
        LINEAR16 = 1,
        MP3 = 2,
        OGG_OPUS = 3,
        MULAW = 5,
        ALAW = 6
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

interface SpeechesToSave {
    id: number;
    audioId: string;
    definitions: {
        id: number;
        audioId: string;
        examples: {
            id: number;
            audioId: string;
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

    downloadSpeech = async (titles: Array<Word>): Promise<Array<SpeechesToSave>> => {
        const googleClient = new TextToSpeech.TextToSpeechClient();

        return await Promise.all(titles.map(async ({ id: titleId, title, definitions, }) => {

            const request = {
              input: { text: title },
              voice: { languageCode: 'en-US', ssmlGender: SsmlVoiceGender.NEUTRAL },
              audioConfig: { audioEncoding: AudioEncoding.MP3 },
            };

            const [response] = await googleClient.synthesizeSpeech(request);

            const fileUuidForTitle = await this.resourceService.saveAudio(response.audioContent)

            const definitionsToSave = await Promise.all(definitions.map(async ({ id: definitionId, definition, examples }) => {

                const request = {
                    input: { text: definition },
                    voice: { languageCode: 'en-US', ssmlGender: SsmlVoiceGender.NEUTRAL },
                    audioConfig: { audioEncoding: AudioEncoding.MP3 },
                  };
          
                  const [response] = await googleClient.synthesizeSpeech(request);
      
                  const fileUuidForDefinition = await this.resourceService.saveAudio(response.audioContent)

                const examplesToSave = await Promise.all(examples.map(async ({ id: exampleId, example}) => {

                    const request = {
                        input: { text: example },
                        voice: { languageCode: 'en-US', ssmlGender: SsmlVoiceGender.NEUTRAL },
                        audioConfig: { audioEncoding: AudioEncoding.MP3 },
                      };
              
                      const [response] = await googleClient.synthesizeSpeech(request);
          
                      const fileUuidForExample = await this.resourceService.saveAudio(response.audioContent)


                    return {
                        id: exampleId,
                        audioId: fileUuidForExample,
                    }
                }))

                return {
                    id: definitionId,
                    audioId: fileUuidForDefinition,
                    examples: examplesToSave,
                }
            }))

            return {
                id: titleId,
                audioId: fileUuidForTitle,
                definitions: definitionsToSave,
            }
        }))

    }

    saveSpeech = async (speechesToSave: Array<SpeechesToSave>): Promise<void> => {
        
        const titlesToSave = speechesToSave.map(({ id, audioId }) => ({
            id,
            audioId,
        }))

        await this.titleRepository.save(titlesToSave)

        const definitionsToSave = speechesToSave.flatMap(({ definitions }) => {
            return definitions.map(({ id, audioId }) => ({
                id,
                audioId,
            }))
        })

        await this.definitionRepository.save(definitionsToSave)

        const examplesToSave = speechesToSave.flatMap(({ definitions }) => {
            return definitions.flatMap(({ examples }) => {
                return examples.map(({ id, audioId }) => ({
                    id, 
                    audioId,
                }))
            })
        })

        await this.exampleRepository.save(examplesToSave)

    }

}
