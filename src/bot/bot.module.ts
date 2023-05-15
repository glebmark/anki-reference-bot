import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParserModule } from '../parser/parser.module';
import { SpeechModule } from '../speech/speech.module';
import { BotService } from './bot.service';
import { Definition } from '../title/entities/definition.entity';
import { Example } from '../title/entities/example.entity';
import { TitleUserProgress } from '../title/entities/title-user-progress.entity';
import { Title } from '../title/entities/title.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Title,
      TitleUserProgress,
      Definition,
      Example,
    ]),
    ParserModule, 
    SpeechModule
  ],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
