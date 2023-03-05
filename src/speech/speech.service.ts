import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const TextToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs')
const util = require('util')

@Injectable()
export class SpeechService {

    constructor (
        // @InjectRepository(Speech)
        // private speechRepository: Repository<Speech>,
    ) {}

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
  
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(`${path}${filename}`, response.audioContent, 'binary');
    }
}
