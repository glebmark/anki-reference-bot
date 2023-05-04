import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { differenceWith } from 'lodash';

import { ParserService } from '../parser/parser.service';
import { SpeechService } from '../speech/speech.service';
import { regExpAllLanguages } from './bot.constants';
import { LanguageType, Title } from './entities/title.entity';
import { TitleUserProgress } from './entities/title-user-progress.entity';

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

    // TODO
    // bot.catch
    // TODO prevent error on /commands

    bot.api.sendMessage(process.env.TEST_USER, `Bot started at ${new Date()}`);

    bot.start();
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

    const newTitles = newTitlesRaw.map(({ title, transcription, partOfSpeech, definitions, languageType }) => ({
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

    console.dir(newSavedTitles, { depth: 10 })

    // download only for selected user as text-to-speech costs $$$
    if (ctx.message.from.id === +process.env.TEST_USER) {
      
      const downloadedSpeech = await this.speechService.downloadSpeech(newSavedTitles)

      await this.speechService.saveSpeech(downloadedSpeech)


    }

    // TODO form appropriate response in html or another form + add speech?
    // fix Message too long error, may be split in several messages?
    // retrive audio by [...newSavedTitles.map(({ id }) => id), ...alreadySavedTitles.map(({ id }) => id)]

    ctx.reply(JSON.stringify('done'));

  };
}
