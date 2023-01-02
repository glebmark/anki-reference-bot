import { Injectable } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import { regExpAllLanguages } from './bot.constants';

@Injectable()
export class BotService {
  private readonly bot: Bot;

  constructor() {
    this.bot = new Bot(process.env.BOT_TOKEN);

    this.bot.on('message:text', this.onMessage);

    this.bot.api.sendMessage(
      process.env.TEST_USER,
      `Server started at ${new Date()}`,
    );

    this.bot.start();
  }

  onMessage = (ctx: Context) => {
    const isSuitableText = ctx.hasText(regExpAllLanguages);

    if (!isSuitableText) {
      ctx.reply('Bot accepts only text characters');
    }

    ctx.reply('Echo: ' + ctx.message.text);

    console.dir(ctx, { depth: 10 });
  };
}
