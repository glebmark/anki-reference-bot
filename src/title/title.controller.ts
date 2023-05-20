import {
    Controller,
    Get,
    Post,
    Query,
  } from '@nestjs/common';
import { TitleService } from './title.service';

@Controller('title')
export class TitleController {

    constructor(
        private readonly titleService: TitleService,
      ) {}

    @Get()
    getTitles() { //: Promise<GetProfileResponseDto>
        return this.titleService.getTitles();
    }

    @Post()
    async confirmTitles(
      @Query('titles') titles: Array<string>
    ){
      return this.titleService.confirmTitlesSaved(titles);
    }

}
