import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { Word } from 'src/speech/speech.service';

import { LanguageType } from '../bot/entities/title.entity';

export type IncomingWord = Omit<Word, 
  'id' | 
  'audioId' | 
  'examples' | 
  'definitions'> & {
    definitions: {
      definition: string;
      examples: string[];
    }[]
}

@Injectable()
export class ParserService {
  getTitles = async (text: string): Promise<Array<IncomingWord>> => {

    // for phrasal verbs: for example "run off" will be converted to "run-off"
    const titleToParse = text.replace(/\s\b/g, '-'); 

    const rawHtml = await axios.get(`https://dictionary.cambridge.org/dictionary/english/${titleToParse}`);

    const root = parse(rawHtml.data);

    const englishDictionary = root.querySelector(`[data-id="cald4"]`);

    if (!englishDictionary) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `English Dictionary haven't been found`,
      });
    }

    return englishDictionary
      .querySelector(`.di-body`)
      .querySelectorAll(`.entry`)
      .map((entry) => {
        const title = entry.querySelector(`.di-title`).rawText;

        const partOfSpeech = entry.querySelector(`.pos.dpos`).rawText

        const transcription = entry.querySelector(`.ipa.dipa.lpr-2.lpl-1`).rawText

        const definitions = entry.querySelectorAll(`.pr.dsense`).map((definitionElement) => {
          
          const definition = definitionElement.querySelector(`.def.ddef_d.db`).rawText;

          const exampleBlock = definitionElement.querySelector(`.def-body.ddef_b`);

          const examples = exampleBlock.querySelectorAll(`.eg.deg`).map((example) => example.rawText);

          return {
            definition,
            examples,
          };
        });

        return {
          title,
          transcription,
          partOfSpeech,
          languageType: LanguageType.ENGLISH, // TODO add logic eng / fr
          definitions,
        };
      });
  };
}
