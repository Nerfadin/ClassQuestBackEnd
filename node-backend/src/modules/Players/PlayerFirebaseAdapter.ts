import { oneDocumentP } from "../../utils/firestoreUtils";
import { adminDb } from "../../app";
import { Singleton } from "../../utils/tsyringe";
import { firestore } from "firebase-admin";
import { ItemInventory, PlayerStat, PlayerStats } from "./PlayerDtos";

const STATS = "characterStats";
export const PLAYER_INVENTORY = "playerInventory";
@Singleton()
export class PlayerFirebaseAdapter {
  getPlayerStats(playerId: string) {
    const playerStatsSnap = adminDb.collection(STATS).doc(playerId).get();
    return oneDocumentP<PlayerStat>(playerStatsSnap);
  }
  savePlayerStats(playerId: string, playerStats: PlayerStats) {
    return adminDb.collection(STATS).doc(playerId).set({ playerStats });
    //return playerStatsDoc.set({ });
  }

  async createPlayerStats(playerId: string) {
    var playerStats: { [id: string]: PlayerStat } = {};
    playerStats = {
      str: {
        stat: "str",
        value: 1,
      },
      agi: {
        stat: "agi",
        value: 1,
      },
      dex: {
        stat: "dex",
        value: 1,
      },
      vit: {
        stat: "vit",
        value: 1,
      },
    };
    await adminDb.collection(STATS).doc(playerId).set({
      freePoints: 0,
      playerStats,
    });
  }
  async savePlayerInventory(
    itens: ItemInventory,
    playerId: string,
    updateGold: boolean = false,
    goldAmount: number = 0
  ) {
    
    const inventoryUpdated = await adminDb
      .collection(PLAYER_INVENTORY)
      .doc(playerId)
      .set(
        {
          itens: itens,
          playerId: playerId,
          
        },
        { merge: true }
      )
      .then(() => {
        updateGold
          ? adminDb
              .collection(PLAYER_INVENTORY)
              .doc(playerId)
              .set({ gold: firestore.FieldValue.increment(goldAmount) }, {merge: true })
          : "";
      });
    return inventoryUpdated;
  }
  getPlayerInventory (playerId: string){
    return oneDocumentP<ItemInventory>( adminDb.collection(PLAYER_INVENTORY).doc(playerId).get());
  }
}
