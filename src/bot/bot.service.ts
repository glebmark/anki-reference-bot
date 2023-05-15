import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context, GrammyError, HttpError, InputFile } from 'grammy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { differenceWith } from 'lodash';
import { readFile } from 'fs/promises';

import { ParserService } from '../parser/parser.service';
import { SpeechService } from '../speech/speech.service';
import { regExpAllLanguages } from './bot.constants';
import { LanguageType, Title } from '../title/entities/title.entity';
import { TitleUserProgress } from '../title/entities/title-user-progress.entity';

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    private parserService: ParserService,
    private speechService: SpeechService,
    @InjectRepository(Title)
    private titleRepository: Repository<Title>,
    @InjectRepository(TitleUserProgress)
    private titleUserProgressRepository: Repository<TitleUserProgress>,
    ) {}

  async onModuleInit() {
    const bot = new Bot(process.env.BOT_TOKEN);

    bot.on('message:text', this.onMessage);

    bot.start();
    
    bot.api.sendMessage(process.env.TEST_USER, `Bot started at ${new Date()}`);

    bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        console.error(e.description);
        ctx.reply(e.description);
      } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
      } else {
        console.error("Unknown error:", e);
      }
    });
  }

  onMessage = async (ctx: Context) => {
    const isTextValid = ctx.hasText(regExpAllLanguages);

    if (!isTextValid) {
      ctx.reply('Bot accepts only text characters');
    }

    const newTitlesRaw = await this.parserService.getTitles(ctx.message.text);

    if (!newTitlesRaw) {
      ctx.reply("Requested word haven't been found");
    }

    const newTitles = newTitlesRaw.titles.map(({ title, transcription, partOfSpeech, definitions, languageType }) => ({
      title,
      transcription,
      partOfSpeech,
      languageType,
      definitions: definitions.map(({ definition, examples }) => ({
        definition,
        examples: examples.map(example => ({ example }))
      }))
    }))

    const alreadySavedTitles = await this.titleRepository.find({
      select: ['id', 'title'],
      where: {
        title: In(newTitles.map(({ title }) => title))
      }
    })

    const titlesToSave = differenceWith(newTitles, alreadySavedTitles, 
      (newTitle, savedTitle) => newTitle.title === savedTitle.title)

    const newSavedTitles = await this.titleRepository.save(titlesToSave)

    // console.dir(newSavedTitles, { depth: 10 })

    // download only for selected user as text-to-speech costs $$$
    if (ctx.message.from.id === +process.env.TEST_USER) {
      
      // const downloadedSpeech = await this.speechService.downloadSpeech(newSavedTitles)

      // await this.speechService.saveSpeech(downloadedSpeech)

    }

    console.dir(newTitles, { depth: 10 })

    const url = `<a href="${newTitlesRaw.url}">${ctx.message.text}</a>`

    const message = newTitles.reduce((acc, 
      { title, 
        transcription, 
        partOfSpeech,
        definitions, }, titleIndex) => {

      const definitionsAndExamplesToSend = definitions.reduce((accDefinitions, { definition, examples }, definitionIndex) => {

        const examplesToSend = examples.reduce((accExample, { example }) => {

          return accExample + `\n<i>${example}</i>`
        }, '')

        return accDefinitions + `\n\n<code>${titleIndex + 1}.${definitionIndex + 1}) ${definition}</code>\n` + examplesToSend
      }, '')
          
      const messagePart = `\n\n<b>${titleIndex + 1}) ${title}</b>` + ` (${partOfSpeech})` +
      `\n${transcription}` + definitionsAndExamplesToSend

      return acc + messagePart
    }, '') // TODO better to add url?

    if (message.length > 4000) {
      const messageFirstSliceToSearch = message.slice(0, 4000)

      const endingsOfDefinitionsAndExamples = [...messageFirstSliceToSearch.matchAll(/e>|i>$/gm)]

      const lastEnding= { ...endingsOfDefinitionsAndExamples[endingsOfDefinitionsAndExamples.length - 1]}

      const lastEndingIndex = lastEnding.index
      
      const messageFirstSlice = message.slice(0, lastEndingIndex + 2)
      const messageSecondSlice = message.slice(lastEndingIndex + 3)
  
      await ctx.reply(messageFirstSlice, { parse_mode: 'HTML'});
      await ctx.reply(messageSecondSlice, { parse_mode: 'HTML'});
    } else {
      await ctx.reply(message, { parse_mode: 'HTML'});
    }

    // const file = await readFile('./audio/0bfc4c9f-fc96-4775-ba72-c9ea3b07dd45.mp3')
    // await ctx.replyWithAudio(new InputFile(file));
  };
}
