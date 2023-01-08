import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';

@Injectable()
export class ParserService {
  getTitles = async (text: string) => {
    const textToUrl = text.replace(/\s\b/g, '-');

    const rawHtml = await axios.get(`https://dictionary.cambridge.org/dictionary/english/${textToUrl}`);

    const root = parse(rawHtml.data);

    const englishDictionary = root.querySelector(`[data-id="cald4"]`);

    if (!englishDictionary) {
      return null;
    }

    return englishDictionary
      .querySelector(`.di-body`)
      .querySelectorAll(`.entry`)
      .map((entry) => {
        const title = entry.querySelector(`.di-title`).rawText;

        // TODO add transcription

        const definitions = entry.querySelectorAll(`.pr.dsense`).map((definition) => {
          const definitionName = definition.querySelector(`.def.ddef_d.db`).rawText;

          const exampleBlock = definition.querySelector(`.def-body.ddef_b`);

          const examples = exampleBlock.querySelectorAll(`.eg.deg`).map((example) => example.rawText);

          return {
            definitionName,
            examples,
          };
        });

        return {
          title,
          definitions,
        };
      });
  };
}
