import { Module } from '@nestjs/common';
import { ParserModule } from '../parser/parser.module';
import { BotService } from './bot.service';

@Module({
    imports: [ParserModule],
    providers: [BotService],
    exports: [BotService],
})
export class BotModule {}
