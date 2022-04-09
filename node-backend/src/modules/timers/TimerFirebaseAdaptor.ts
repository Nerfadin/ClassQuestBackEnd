import { Timestamp } from "../../../../packages/interfaces/quest";
import { adminDb } from "../../app";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { oneDocumentP } from "../../utils/firestoreUtils";
import { Singleton } from "../../utils/tsyringe";
const TIMERS = "timers";
@Singleton()
export class TimerFirebaseAdaptor {
  saveEvent(userId: string, update: Record<string, any>) {
    return adminDb.collection(TIMERS).doc(userId).set(update, { merge: true });
  }
  getEvents(userId: string) {
    return oneDocumentP<{ id: string } & Record<string, Timestamp>>( // TODO: TeacherInstitutionPlan
      adminDb.collection(TIMERS).doc(userId).get()
    ).catch((err) => {
      if (err instanceof EntityNotFoundError) {
        return { id: userId };
      } else throw err;
    });
  }
}
