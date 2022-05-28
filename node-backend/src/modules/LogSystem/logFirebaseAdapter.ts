import { ILogDto } from './LogsDtos';
import { adminDb } from '../../app';
import { manyDocumentsOrErrorP } from "../../utils/firestoreUtils";
export const LOGS = "Logs"
export class LogFirebaseAdapter {
    async saveLog(log: ILogDto) {
        const doc = await adminDb.collection(LOGS).add(log);
        return await adminDb.collection(LOGS).doc(doc.id).get();
    }
    
    async getLogByUser(userId: string) {    
        return await manyDocumentsOrErrorP<ILogDto>(adminDb.
            collection(LOGS)
            .where("userId", "==", userId)
            .get());
    }
}