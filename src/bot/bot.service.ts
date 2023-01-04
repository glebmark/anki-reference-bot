import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import { ParserService } from '../parser/parser.service';
import { regExpAllLanguages } from './bot.constants';

@Injectable()
export class BotService implements OnModuleInit {
  constructor(private parserService: ParserService) {}

  async onModuleInit() {
    const bot = new Bot(process.env.BOT_TOKEN);

    bot.on('message:text', this.onMessage);

    const definitions = await this.parserService.getDefinitions();

    console.dir(definitions, { depth: 10 });

    bot.start();
  }

  onMessage = async (ctx: Context) => {
    const isSuitableText = ctx.hasText(regExpAllLanguages);

    if (!isSuitableText) {
      ctx.reply('Bot accepts only text characters');
    }

    const definitions = await this.parserService.getDefinitions();

    ctx.reply('Echow: ' + ctx.message.text);
  };
}
