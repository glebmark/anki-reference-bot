import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TitleUserProgress } from './entities/title-user-progress.entity';
import { Title } from './entities/title.entity';
import { TitleController } from './title.controller';
import { TitleService } from './title.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TitleUserProgress,
      Title
    ]),
  ],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
