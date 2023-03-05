import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpeechService } from './speech.service';
import { Resource } from '../resource/entities/resource.entity';
import { ResourceModule } from '../resource/resource.module';
import { Title } from '../bot/entities/title.entity';
import { Definition } from '../bot/entities/definition.entity';
import { Example } from '../bot/entities/example.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
          Resource,
          Title,
          Definition,
          Example
        ]),
        ResourceModule
      ],
    providers: [SpeechService],
    exports: [SpeechService],
})
export class SpeechModule {}
