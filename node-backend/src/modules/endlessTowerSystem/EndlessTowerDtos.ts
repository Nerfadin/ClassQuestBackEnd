import { Player } from '@interfaces/player';
import {Quest, Question} from '@interfaces/quest';
import {Timestamp} from '@interfaces/quest';
import { AnswerDto } from '@interfaces/routes/AnswerDto';

export interface towerQuestionList {
    towerId: string,
    subject: string,
    schoolYear?: string,
    listId: string,
    quests: Quest[],
    hasImportedQuests: boolean,
    importedQuestsIds: string[],
}
export interface CreateTowerQuestDto{
    quest: Quest,
    towerId: string,
    questId: string,
    ownedByTeacherId: string,

}

export interface CreateTowerDto {
    towerPin: string,    
    name: string,
    institutionId: string,    
    playersIds: string[],
    createdAt: Timestamp
}
export interface CreateTowerQuestListDto{
    towerPin: string,    
    name: string,
    institutionId: string,    
    players: Player[],
    createdAt: Timestamp
}
export interface TowerQuest {
    questName: string,
    quest: Quest
    towerQuestId: string,
    towerId: string,
    isPublished: boolean,
}
export interface EndlessTower {
    towerPin: string,    
    towerName: string,
    institutionId: string,    
    players: Player[],
    createdAt: Timestamp
}
export interface TowerReport {
    reportPlayerId: string,
    answeredQuestions: Question[],
    questionAnswers: AnswerDto
}