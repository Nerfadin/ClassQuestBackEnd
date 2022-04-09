import { adminDb } from "../../app";
import { HouseDto } from "./HousesDto";
import { firestore } from "firebase-admin";
import { manyDocumentsOrErrorP, oneDocumentP } from "../../utils/firestoreUtils";
import { Singleton } from "../../utils/tsyringe";
import { chestDto } from "../playerInventory/InventoryDto";

export const HOUSES = "houses";
export const GRID = "grid";
@Singleton()
export class HouseFirebaseAdapter {
  async createHouse(playerId: string) {
    const house = await adminDb
      .collection(HOUSES)
      .add({
        houseLevel: 1,
        ownerPlayerId: playerId,
        rented: false,
        revenue: 0,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        houseId: "",
        grids: [        
        ],
      })
      .then((snapshot) => {
        snapshot.set(
          {houseid: snapshot.id},
          { merge: true }
        );
        return oneDocumentP<HouseDto>(adminDb.collection(HOUSES).doc(snapshot.id).get())
      });
      
    return house;
  }
  async deleteHouse(houseId: string) {
    adminDb.collection(HOUSES).doc(houseId).delete();
  }
  async saveHouseChest(playerId: string, chest: chestDto) {
    adminDb.collection(HOUSES).doc(playerId).set({
      itens: chest.itens,
      playerId: playerId,
      
    });
  }
  async getHouse(playerId: string) {
    const house = await manyDocumentsOrErrorP<HouseDto>(
      adminDb.collection(HOUSES).where("ownerPlayerId", "==", playerId).get()
    );
    return house[0];
  }
  async hasHouse(playerId: string): Promise<boolean> {
    const result = await adminDb
      .collection(HOUSES)
      .where("ownerPlayerId", "==", playerId)
      .get()
      .then(function (snapshot) {
        if (snapshot.empty) {
          return false;
        } else {
          return true;
        }
      });
    return result;
  }
  async getHouseId(playerId: string): Promise<string> {
    return await adminDb
      .collection(HOUSES)
      .where("ownerPlayerId", "==", playerId)
      .limit(1)
      .get()
      .then((querrySnapshot) => {
        return querrySnapshot.docs[0].id;
      });
  }

  saveHouse(body: HouseDto, houseId: string) {
    adminDb
      .collection(HOUSES)
      .doc(houseId)
      .set({
        ...body,
      });
  }
}
