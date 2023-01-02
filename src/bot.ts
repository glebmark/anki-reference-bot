import { Bot } from "grammy";
import { BotService } from './bot/bot.service'

const botService = new BotService()

export function initBot () {
    
    const bot = new Bot(process.env.BOT_TOKEN);

    bot.on("message:text", botService.onMessage);

    bot.start();
}