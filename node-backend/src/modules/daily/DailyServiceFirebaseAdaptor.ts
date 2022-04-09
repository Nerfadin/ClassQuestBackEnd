import { adminDb } from "../../app";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { oneDocumentP } from "../../utils/firestoreUtils";
import { Singleton } from "../../utils/tsyringe";
import { PlayerDailyRewardDto } from "./PlayerDailyReward";

@Singleton()
export class DailyServiceFirebaseAdaptor {
  saveDaily(userId: string, playerDailyReward: PlayerDailyRewardDto) {
    return adminDb
      .collection("daily")
      .doc(userId)
      .set(playerDailyReward, { merge: true });
  }
  getDaily(userId: string) {
    return oneDocumentP<PlayerDailyRewardDto>(
      adminDb.collection("daily").doc(userId).get()
    ).catch((e) => {
      if (e instanceof EntityNotFoundError) return undefined;
      else throw e;
    });
  }
}
