import { manyDocuments } from "../../utils/firestoreUtils";
import { adminDb } from "../../app";
import { Singleton } from "../../utils/tsyringe";
import { PLAYERS } from "../quests/QuestFirebaseAdaptor";
import { ANSWERS } from "../quests/QuestFirebaseAdaptor";
import { AnswerDto } from "../../../../packages/interfaces/routes/AnswerDto";

@Singleton()
export class PvPFacade {
    async getPvPQuests(questAmount: number, playerId: string){
        const answredQuests = manyDocuments<AnswerDto>(await adminDb.collection(PLAYERS).doc(playerId).collection(ANSWERS).get())
        const questsIds = answredQuests.map((a) => {
                if (a.score > 0.6) {
                    return a.id;
                } else if (a.score < 0.4) {
                    return null;
                }else {
                    return a.id; 
                }
        
            });
            return questsIds;
    }
}
