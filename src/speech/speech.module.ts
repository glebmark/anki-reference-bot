import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Speech } from './entities/speech.entity';
import { SpeechService } from './speech.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
          Speech,
        ]),
      ],
    providers: [SpeechService],
    exports: [SpeechService],
})
export class SpeechModule {}
