import { Module } from '@nestjs/common';
import { ParserModule } from '../parser/parser.module';
import { SpeechModule } from '../speech/speech.module';
import { BotService } from './bot.service';

@Module({
  imports: [ParserModule, SpeechModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
