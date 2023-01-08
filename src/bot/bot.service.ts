import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParserService } from '../parser/parser.service';
import { SpeechService } from '../speech/speech.service';
import { regExpAllLanguages } from './bot.constants';
import { LanguageType, Title } from './entities/title.entity';
import { Example } from './entities/example.entity';
import { Definition } from './entities/definition.entity';
import { TitleUserProgress } from './entities/title-user-progress.entity';

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    private parserService: ParserService,
    private speechService: SpeechService,
    @InjectRepository(Title)
    private titleRepository: Repository<Title>,
    @InjectRepository(Definition)
    private definitionRepository: Repository<Definition>,
    @InjectRepository(Example)
    private exampleRepository: Repository<Example>,
    @InjectRepository(TitleUserProgress)
    private titleUserProgressRepository: Repository<TitleUserProgress>,
    ) {}

  async onModuleInit() {
    const bot = new Bot(process.env.BOT_TOKEN);

    bot.on('message:text', this.onMessage);

    bot.api.sendMessage(process.env.TEST_USER, `Bot started at ${new Date()}`);

    bot.start();
  }

  onMessage = async (ctx: Context) => {
    const isSuitableText = ctx.hasText(regExpAllLanguages);

    // TODO prevent error on /commands

    if (!isSuitableText) {
      ctx.reply('Bot accepts only text characters');
    }

    const titles = await this.parserService.getTitles(ctx.message.text);

    console.dir(titles, { depth: 10 });

    // add transcription
    // add partOfSpeech

    const titlesToSave = titles.map(title => {

      const definitions = title.definitions.map(definition => {

        const examples = definition.examples.map(example => {
          return Example.create({
            example,
          })
        })
        
        return Definition.create({ definition: definition.definitionName, examples: examples})
    
      })

      return Title.create({
        title: title.title,
        languageType: LanguageType.ENGLISH,
        definitions: definitions, // make shorter
      })
    })

    const savedTitles = await this.titleRepository.save(titlesToSave)

    // await this.definitionRepository.find({where: {
    //   titleId: 1
    // }})


    if (ctx.message.from.id === +process.env.TEST_USER) {
      
      // await this.speechService.getSpeech()

    }


    ctx.reply(titles ? JSON.stringify(titles) : "Requested word haven't been found");

    // TODO form appropriate response in html or another form
  };
}
