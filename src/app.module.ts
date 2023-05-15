import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { TypeOrmModule } from '@nestjs/typeorm';
import { createConfig } from './orm-config';

import { BotModule } from './bot/bot.module';
import { ParserModule } from './parser/parser.module';
import { SpeechModule } from './speech/speech.module';
import { UserModule } from './user/user.module';
import { ResourceModule } from './resource/resource.module';
import { TitleController } from './title/title.controller';
import { TitleModule } from './title/title.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(),
        LOG_QUERIES: Joi.boolean().required(),
        SYNCHRONIZE: Joi.boolean().required(),
        DB_SSL: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createConfig({
          autoLoadEntities: true,
          url: configService.get<string>('DB_URL'),
          ssl: configService.get<boolean>('DB_SSL'),
          synchronize: configService.get<boolean>('SYNCHRONIZE'),
          logging: configService.get<boolean>('LOG_QUERIES')
            ? 'all'
            : ['error'],
        }),
      inject: [ConfigService],
    }),
    BotModule,
    ParserModule,
    SpeechModule,
    UserModule,
    ResourceModule,
    TitleModule,
  ],
  controllers: [TitleController],
  providers: [],
})
export class AppModule {}
