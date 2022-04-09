import { Singleton, Inject } from "../../utils/tsyringe";
import { ShopFirebaseAdapter } from "./ShopFirebaseAdapter";
import dayjs from "dayjs";

@Singleton()
export class ShopService {
  constructor(
    @Inject(() => ShopFirebaseAdapter) private shopDao: ShopFirebaseAdapter
  ) {}
  async getShopItems() {
    const shop = await this.shopDao.getShop();
    const expiresIn = dayjs(shop.nextRefreshAt.toDate()).diff(
      dayjs(),
      "minute"
    ); // quantos minutos faltam
    return {
      ...shop,
      expiresIn,
    };
  }
  refreshShop(nextRefreshTime: Date) {
    const idsCount = 33; // 0 - 43
    const itemsCount = 8;
    const selectedIds = Array.from({ length: itemsCount }).map(() =>
      getRndInteger(0, idsCount)
    );
    return this.shopDao.saveShop(selectedIds, nextRefreshTime);
  }
}
export function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
