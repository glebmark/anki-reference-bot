import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpeechService } from './speech.service';
import { Resource } from '../resource/entities/resource.entity';
import { ResourceModule } from '../resource/resource.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
          Resource,
        ]),
        ResourceModule
      ],
    providers: [SpeechService],
    exports: [SpeechService],
})
export class SpeechModule {}
