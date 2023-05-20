import {
    Controller,
    Get,
    Param,
    StreamableFile,
  } from '@nestjs/common';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {

    constructor(
        private readonly resourceService: ResourceService,
      ) {}

    @Get(':uuid')
    async getResource(@Param('uuid') uuid: string) {
      const file = await this.resourceService.getReadableDataStreamById(uuid);

      return new StreamableFile(file);
    }

}
