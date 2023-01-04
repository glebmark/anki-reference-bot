import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';

@Injectable()
export class ParserService {
  getDefinitions = async () => {
    const rawHtml = await axios.get('https://dictionary.cambridge.org/dictionary/english/think');

    // TODO transform "make out" to "make-out" and put to URL
    // TODO validate if URL exist

    const root = parse(rawHtml.data);

    const englishDictionary = root.querySelector(`[data-id="cald4"]`);

    return englishDictionary
      .querySelector(`.di-body`)
      .querySelectorAll(`.entry`)
      .map((entry) => {
        // TODO fix excessive commas

        const title = entry
          .querySelector(`.di-title`)
          .childNodes.map((node) => node.rawText)
          .join();

        const definitions = entry.querySelectorAll(`.pr.dsense`).map((definition) => {
          const definitionName = definition
            .querySelector(`.def.ddef_d.db`)
            .childNodes.map((node) => node.rawText)
            .join();

          const examples = definition
            .querySelector(`.def-body.ddef_b`)
            .querySelectorAll(`.eg.deg`)
            .map((example) => example.rawText);

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
