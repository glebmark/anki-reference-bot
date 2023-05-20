import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

        // title names are only for displaying in Anki pop-up
        const titleNames = titles.map(({ title: { title } }) => title).join('<br><br>')

        // title id's are only for subsequent confirmation by POST that titles were saved
        const titleIds = titles.map(({ title: { id } }) => id)

        // text is for importing in Anki deck
        const text = titles.reduce((titlesText, { title }): string => {

            const definitionsText = this.resolveDefinitionsText(title)

            return titlesText += definitionsText
        }, '')

        console.log(text)
        
        return {
            audio: ['uuid1.mp3', 'uuid2.mp3'],
            titleIds,
            titleNames,
            text,
            // add field with just names of titles to show it in showInfo
        }
    }

    private resolveDefinitionsText = ({ title, partOfSpeech, transcription, definitions, audio, audioId }: Title): string => {
        return definitions.reduce((definitionText, definition: Definition) => {

            const examplesText = this.resolveExamplesText(definition.examples)

            const soundOfTitle = `[sound:${audioId}.${audio.fileFormat}]`
            
            const frontOfCard = '<b>' + title + '</b>' + '<br><br>' + 
            transcription + soundOfTitle + partOfSpeech + '<br><br><br><br>' + examplesText

            const soundOfDefinition = `[sound:${definition.audioId}.${definition.audio.fileFormat}]`
            
            const backOfCard = definition.definition + soundOfDefinition + '<br><br>'
            
            const recognitionCard = frontOfCard + '\t' + backOfCard + '\n'

            const recallCard = backOfCard + '\t' + frontOfCard + '\n'
            
            return definitionText += recognitionCard + recallCard
        }, '')
    }

    private resolveExamplesText = (examples: Example[]): string => {
        return examples.reduce((examplesText, { example, audio, audioId }: Example) => {

            const sound = `[sound:${audioId}.${audio.fileFormat}]`
            
            return examplesText += example + sound + '<br><br>'
        }, '')
    }

    confirmTitlesSaved = async (titles: Array<string>) => {

        const titlesIds: Array<number> = titles.map(title => Number(title))
        
        console.log('titles')
        console.log(titlesIds)

        await this.titleUserProgressRepository.update({
            userId: 1,
            titleId: In(titlesIds)
        },
        {
            isSavedToAnki: true
        }
        )
    }
}
