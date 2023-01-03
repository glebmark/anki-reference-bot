import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';

@Injectable()
export class ParserService {

    public getDefinitions = async () => {

        const rawHtml = await axios.get('https://dictionary.cambridge.org/dictionary/english/think')
        
        // const root = parse(rawHtml);
        
        // console.dir(rawHtml.data, { depth: 10 })

        return 'qwe'
    }
}
