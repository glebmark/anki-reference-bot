import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParserModule } from '../parser/parser.module';
import { SpeechModule } from '../speech/speech.module';
import { BotService } from './bot.service';
import { TitleUserProgress } from './entities/title-user-progress.entity';
import { Title } from './entities/title.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Title,
      TitleUserProgress
    ]),
    ParserModule, 
    SpeechModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
