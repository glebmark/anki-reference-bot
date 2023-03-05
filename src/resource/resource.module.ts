import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resource,
    ]),
  ],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
