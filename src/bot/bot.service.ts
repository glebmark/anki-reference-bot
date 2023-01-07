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

    // TODO delete
    const definitions = await this.parserService.getDefinitions('think');

    // console.dir(definitions, { depth: 10 });

    bot.api.sendMessage(process.env.TEST_USER, `Bot started at ${new Date()}`);

    bot.start();
  }

  onMessage = async (ctx: Context) => {
    const isSuitableText = ctx.hasText(regExpAllLanguages);

    // TODO prevent error on /commands

    if (!isSuitableText) {
      ctx.reply('Bot accepts only text characters');
    }

    const definitions = await this.parserService.getDefinitions(ctx.message.text);

    // console.dir(definitions, { depth: 10 });

    // add transcription
    // add partOfSpeech

    let counter = 0

    // const definitionsToSave = definitions.map(title => {
    //   console.log(counter)
    //   counter++

    //   const definitions = title.definitions.map(definition => {
        
    //     return Definition.create({ titleId: title.title, definition: definition.definitionName})

    //   //   {
    //   //   titleId: title.title,
    //   //   definition: definition.definitionName,
    //   //   // examples: definition.examples.map(example => ({
    //   //   //   example,
    //   //   // }))
    //   // }
    
    //   })

    //   console.log(definitions)

    //   return Title.create({
    //     title: title.title,
    //     languageType: LanguageType.ENGLISH,
    //     definitions: definitions,
    //   })
    // })

    // console.dir(definitionsToSave, { depth: 10 })

    const def = Definition.create({ definition: 'test_definition'})

    const def2 = Definition.create({ definition: 'test_definition_2'})

    // const defToSave = {
    //   title: 'test_title', 
    //   languageType: LanguageType.ENGLISH,
    //   definitions: [def]
    // }

    const defToSave2 = {
      title: 'test_title', 
      languageType: LanguageType.ENGLISH,
      definitions: [def, def2]
    }

    const savedTitles2 = await this.titleRepository.save(defToSave2)


    // const savedTitles = await this.titleRepository.save(definitionsToSave)



    if (ctx.message.from.id === +process.env.TEST_USER) {
      
      // await this.speechService.getSpeech()

    }


    ctx.reply(definitions ? JSON.stringify(definitions) : "Requested word haven't been found");

    // TODO form appropriate response in html or another form
  };




    
}
