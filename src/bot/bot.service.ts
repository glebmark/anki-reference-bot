import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import { regExpAllLanguages } from './bot.constants';

@Injectable()
export class BotService {
  // @Inject(ParserService)
  // private parserService: ParserService;
  constructor() {}


  onMessage = async (ctx: Context) => {
    const isSuitableText = ctx.hasText(regExpAllLanguages);

    if (!isSuitableText) {
      ctx.reply('Bot accepts only text characters');
    }

    // const definitions = await this.parserService.getDefinitions()
    

    // console.dir(definitions, { depth: 10 })

    console.log('onMessage')
    
    ctx.reply('Echo: ' + ctx.message.text);

    // console.dir(ctx, { depth: 10 });
  };
}
