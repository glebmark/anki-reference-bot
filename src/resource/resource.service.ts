import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourceService {
    constructor (
      @InjectRepository(Resource)
      private resourceRepository: Repository<Resource>,
  ) {}

  // saveResource = async (resource: ?, ) => {
    
  // }
}
