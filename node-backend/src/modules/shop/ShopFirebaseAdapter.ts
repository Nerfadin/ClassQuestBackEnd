import { adminDb } from "../../app";
import { GlobalShop } from "@interfaces/Shop";
export const SHOP = "game_shop";
export const GLOBAL_SHOP = "global";

export class ShopFirebaseAdapter {
  getShop() {
    return adminDb
      .collection(SHOP)
      .doc(GLOBAL_SHOP)
      .get()
      .then((doc) => doc.data() as GlobalShop);
  }
  saveShop(items: number[], nextRefreshAt: Date) {
    return adminDb.collection(SHOP).doc(GLOBAL_SHOP).set({
      items,
      nextRefreshAt,
    });
  }
}
