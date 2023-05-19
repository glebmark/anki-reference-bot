import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Definition } from './entities/definition.entity';
import { Example } from './entities/example.entity';
import { TitleUserProgress } from './entities/title-user-progress.entity';
import { Title } from './entities/title.entity';

@Injectable()
export class TitleService {
    constructor (
        @InjectRepository(TitleUserProgress)
        private titleUserProgressRepository: Repository<TitleUserProgress>,
    ) {}
  
    getTitles = async () => {

        const titles = await this.titleUserProgressRepository.find({
            where: {
                userId: 1,
                isSavedToAnki: false
            },
            relations: [
                'title', 
                'title.audio', 
                'title.definitions', 
                'title.definitions.audio', 
                'title.definitions.examples', 
                'title.definitions.examples.audio',
            ]
        })

        console.dir(titles, {depth: 10})

        const text = titles.reduce((titlesText, { title }): string => {

            const definitionsText = this.resolveDefinitionsText(title)

            return titlesText += definitionsText
        }, '')

        console.log(text)
  
        return {
            audio: ['uuid1.mp3', 'uuid2.mp3'],
            titleIds: [1, 2, 3],
            text: "TextForFront\tTextForBack.[sound:accomplish_example.mp3]\nTextForFront2\tTextForBack2."
            // add field with just names of titles to show it in showInfo
        }
    }

    private resolveDefinitionsText = ({ title, partOfSpeech, transcription, definitions, audio, audioId }: Title): string => {
        return definitions.reduce((definitionText, definition: Definition) => {

            const examplesText = this.resolveExamplesText(definition.examples)

            const soundOfTitle = `[sound:${audioId}.${audio.fileFormat}]`
            
            const frontOfCard = title + soundOfTitle + '<br><br>' + 
            transcription + '<br><br>' + partOfSpeech + '<br><br><br><br>' + examplesText

            const soundOfDefinition = `[sound:${definition.audioId}.${definition.audio.fileFormat}]`
            
            const backOfCard = definition.definition + soundOfDefinition + '<br><br>'
            
            const recognitionCard = frontOfCard + '\t' + backOfCard + '\n\n\n'

            const recallCard = backOfCard + '\t' + frontOfCard + '\n\n\n'
            
            return definitionText += recognitionCard + recallCard
        }, '')
    }

    private resolveExamplesText = (examples: Example[]): string => {
        return examples.reduce((examplesText, { example, audio, audioId }: Example) => {

            const sound = `[sound:${audioId}.${audio.fileFormat}]`
            
            return examplesText += example + sound + '<br><br>'
        }, '')
    }

    // TODO function POST with id's of titiles which were saved
}
