import { Inject, Singleton } from "../../utils/tsyringe";
import { SaveInventoryDto } from "./InventoryDto";
import { PlayerInventoryAdapter } from "./PlayerInventoryAdapter";

@Singleton()
export class PlayerInventoryService {
  constructor(
    @Inject(() => PlayerInventoryAdapter)
    private playerInventoryDao: PlayerInventoryAdapter
  ) {}

  async savePlayerInventoryComplete(body: SaveInventoryDto) {
    if (body.updateGold) {
      await this.playerInventoryDao.addGoldToPlayer(
        body.playerId,
        body.goldAmount
      );
      console.log("gold");
    }
    if (body.updateHouseInventory) {
      await this.playerInventoryDao.savePlayerHouseInventory(
        body.playerHouseInventory,
        body.playerId
      );
      console.log("House");
    }
    if (body.updatePlayerInventory) {
      await this.playerInventoryDao.savePlayerInventory(body);
      console.log("playerInventory");
    }
    if (body.updateHouseChest) {
      await this.playerInventoryDao.savePlayerChest(
        body.playerId,
        body.playerHouseChest
      );
    }
    return this.playerInventoryDao.getPlayerInventory(body.playerId);
  }
  async getPlayerInventory(playerId: string) {
    return this.playerInventoryDao.getPlayerInventory(playerId).catch(() => {
      return null;
    });
  }
  async addGoldToPlayer(playerId: string, goldAmount: number) {
    return this.playerInventoryDao
      .addGoldToPlayer(playerId, goldAmount)
      .catch(() => {
        return null;
      });
  }
  async updatePlayerGold(playerId: string, goldAmount: number) {
    await this.playerInventoryDao.updateGold(playerId, goldAmount);

  }
  deletePlayerInventory(playerId: string) {
    return this.playerInventoryDao.deletePlayerInventory(playerId);
  }
}
