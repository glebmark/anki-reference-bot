import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ParserService {

    public getDefinitions = async () => {

        const rawHtml = axios.get('https://dictionary.cambridge.org/dictionary/english/think')

        console.dir(rawHtml, { depth: 10 })

        return 'qwe'
    }
}
