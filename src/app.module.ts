import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ParserModule } from './parser/parser.module';
import { SpeechService } from './speech/speech.service';
import { SpeechModule } from './speech/speech.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BotModule,
    ParserModule,
    SpeechModule,
  ],
  controllers: [AppController],
  providers: [AppService, SpeechService],
})
export class AppModule {}
