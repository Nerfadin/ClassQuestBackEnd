import { build, Singleton } from '../../utils/tsyringe';
import { QuestService } from '../../modules/quests/QuestService';

export const PLAYERS = "players";
export const QUESTS = "quests";
export const ANSWERS = "answers"

@Singleton()
export class reportMigrationFacade {
    CreateQuestReport(quest: string) {
        const questService = build(QuestService);                
        const report = questService.getReport(quest);
        console.log(report);
        return report;
    }
}

