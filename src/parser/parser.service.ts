import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { Word } from 'src/speech/speech.service';

import { LanguageType } from '../title/entities/title.entity';

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
  getTitles = async (text: string): Promise<{ url: string, titles: Array<IncomingWord> }> => {

    // for phrasal verbs: for example "run off" will be converted to "run-off"
    const titleToParse = text.replace(/\s\b/g, '-'); 

    const url = `https://dictionary.cambridge.org/dictionary/english/${titleToParse}`

    const rawHtml = await axios.get(url);

    const root = parse(rawHtml.data);

    const englishDictionary = root.querySelector(`[data-id="cald4"]`);

    if (!englishDictionary) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `English Dictionary haven't been found`,
      });
    }

    const incomingWords = englishDictionary
      .querySelector(`.di-body`)
      .querySelectorAll(`.entry`)
      .map((entry) => {
        const title = entry.querySelector(`.di-title`).rawText;

        const partOfSpeech = entry.querySelector(`.pos.dpos`).rawText

        const transcription = entry.querySelector(`.ipa.dipa.lpr-2.lpl-1`).rawText

        const definitions = entry.querySelectorAll(`.pr.dsense`).map((definitionElement) => {
          
          const definition = definitionElement.querySelector(`.def.ddef_d.db`).rawText;

          const exampleBlock = definitionElement.querySelector(`.def-body.ddef_b`);

          const examplesUnrestricted = exampleBlock.querySelectorAll(`.eg.deg`).map((example) => example.rawText);

          // take only chosen amount of examples as many of them could overload card
          const examples = examplesUnrestricted.slice(0, Number(process.env.AMOUNT_OF_EXAMPLES))
          
          // drop definitions without examples
          if (examples.length >= 1) {
            return {
              definition,
              examples,
            };
          } else {
            return
          }
        });

        return {
          title,
          transcription,
          partOfSpeech,
          languageType: LanguageType.ENGLISH, // TODO add logic eng / fr
          definitions: definitions.filter(Boolean),
        };
      });

      return {
        url,
        titles: incomingWords,
      }
  };
}
