import { Injectable } from '@nestjs/common';

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs')
const util = require('util')

@Injectable()
export class SpeechService {
    getSpeech = async () => {
        const client = new textToSpeech.TextToSpeechClient();
  
        const text = 'hello, world!';
  
        const request = {
          input: {text: text},
          voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
          audioConfig: {audioEncoding: 'MP3'},
        };
  
        const [response] = await client.synthesizeSpeech(request);

        const path = './audio/'

        const filename = 'output.mp3'
  
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(`${path}${filename}`, response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3'); // TODO delete
    }
}
