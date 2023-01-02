import { Injectable } from '@nestjs/common';
// const { Bot } = require("grammy");
import { Bot, Context } from 'grammy';
// import {  }  from 'grammy'


@Injectable()
export class BotService {

    private readonly bot: Bot

    constructor() {
        this.bot = new Bot(process.env.BOT_TOKEN);

        this.bot.on("message:text", this.onMessage);

        this.bot.start();
    }

    onMessage = (ctx: Context) => {
        ctx.reply("Echo new2: " + ctx.message.text)
        console.log(ctx)
    }
}
