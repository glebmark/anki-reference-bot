import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        this.getUser()
    }

    getUser = async () => {
        console.dir(await this.userRepository.find({
            relations: ['titles']
        }), { depth: 10 })
    }

}
