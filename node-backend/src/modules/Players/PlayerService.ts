import { PlayerStats, SaveInventoryDto } from "./PlayerDtos";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { Inject, Singleton } from "../../utils/tsyringe";
import { PlayerFirebaseAdapter } from "./PlayerFirebaseAdapter";

@Singleton()
export class PlayerService {
  constructor(
    @Inject(() => PlayerFirebaseAdapter)
    private playerDao: PlayerFirebaseAdapter
  ) {}
  async savePlayInventory(body: SaveInventoryDto) {
   let playerInventory;
    if (body.updateGold) {
        playerInventory = this.playerDao.savePlayerInventory(
            body.inventory,
            body.playerId,
            body.updateGold,
            body.goldAmount
          );
    } else {
   playerInventory = this.playerDao.savePlayerInventory(
            body.inventory,
            body.playerId
          );
    }
    return playerInventory;
  }
  async getPlayerStats(playerId: string) {
    return await this.playerDao.getPlayerStats(playerId).catch((err) => {
      throw err instanceof EntityNotFoundError
        ? new EntityNotFoundError({
            type: "stats_not_Found",
            message: "O jogador não possuí stats ainda",
            details: err,
          })
        : err;
    });
  }
  async savePlayerStats(playerId: string, playerStats: PlayerStats) {
    return await this.playerDao.savePlayerStats(playerId, playerStats);
  }
  async createPlayerStats(playerId: string) {
    await this.playerDao.createPlayerStats(playerId);
  }

}
