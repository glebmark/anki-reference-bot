import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';

import { ParserService } from '../parser/parser.service';
import { SpeechService } from '../speech/speech.service';
import { regExpAllLanguages } from './bot.constants';

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    private parserService: ParserService,
    private speechService: SpeechService,
    ) {}

  async onModuleInit() {
    const bot = new Bot(process.env.BOT_TOKEN);

    bot.on('message:text', this.onMessage);

    const definitions = await this.parserService.getDefinitions('make out some');

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

    if (ctx.message.from.id === +process.env.TEST_USER) {
      
      await this.speechService.getSpeech()

    }


    ctx.reply(definitions ? JSON.stringify(definitions) : "Requested word haven't been found");

    // TODO form appropriate response in html or another form
  };




    
}
