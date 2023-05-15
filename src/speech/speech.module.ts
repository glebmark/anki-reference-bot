import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpeechService } from './speech.service';
import { Resource } from '../resource/entities/resource.entity';
import { ResourceModule } from '../resource/resource.module';
import { Title } from '../title/entities/title.entity';
import { Definition } from '../title/entities/definition.entity';
import { Example } from '../title/entities/example.entity';

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
