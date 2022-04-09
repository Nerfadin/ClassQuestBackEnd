import { oneDocumentP } from "../../utils/firestoreUtils";
import { adminDb } from "../../app";
import { Singleton } from "../../utils/tsyringe";
import { firestore } from "firebase-admin";
import { ItemObject, SaveInventoryDto } from "./InventoryDto";
export const PLAYER_INVENTORY = "playerInventory";
export const CHEST = "houseChest";


@Singleton()
export class PlayerInventoryAdapter {
  async savePlayerInventory(body: SaveInventoryDto) {
    await adminDb.collection(PLAYER_INVENTORY).doc(body.playerId).set(
      {
        playerInventory: body.playerInventory,
        playerId: body.playerId,
      },
      { merge: true }
    );
    return oneDocumentP<SaveInventoryDto>(
      adminDb.collection(PLAYER_INVENTORY).doc(body.playerId).get()
    );
  }
  async savePlayerHouseInventory(itens: ItemObject[], playerId: string) {
    await adminDb.collection(PLAYER_INVENTORY).doc(playerId).set(
      {
        playerHouseInventory: itens,
      },
      { merge: true }
    );
    return oneDocumentP<SaveInventoryDto>(adminDb.collection(PLAYER_INVENTORY).doc(playerId).get());
  }
  async savePlayerChest(playerId: string, itens: ItemObject[]) {
    await adminDb.collection(PLAYER_INVENTORY).doc(playerId).set({
      playerHouseChest: itens
    }, { merge: true })
  }
  deletePlayerInventory(playerId: string) {
    return adminDb.collection(PLAYER_INVENTORY).doc(playerId).delete();
  }
  async updateGold(playerId: string, amount: number) {
    adminDb.collection(PLAYER_INVENTORY).doc(playerId).set({
      gold: amount
    }, { merge: true })
  }
  async addGoldToPlayer(playerId: string, amount: number) {
    await adminDb.collection(PLAYER_INVENTORY).doc(playerId).set({
      gold: firestore.FieldValue.increment(amount)
    }, { merge: true })
    return this.getPlayerInventory(playerId);

  }
  getPlayerInventory(playerId: string) {
    return oneDocumentP<SaveInventoryDto>(adminDb.collection(PLAYER_INVENTORY).doc(playerId).get());
  }


}
