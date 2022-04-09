

import { EntityNotFoundError } from "../../utils/errorUtils";
import { Inject, Singleton } from "../../utils/tsyringe";
import {PlayerStatsAdapter} from './PlayerStatsAdapter';
import { PlayerStats } from "./StatsDtos";
@Singleton()
export class PlayerStatsService {
    constructor(
        @Inject(() =>PlayerStatsAdapter)
        private playerDao: PlayerStatsAdapter,
      ) {}
      async createPlayerStats(playerId: string) {
        await this.playerDao.createPlayerStats(playerId);
      }    
  async savePlayerStats(playerId: string, playerStats: PlayerStats) {
    return await this.playerDao.savePlayerStats(playerId, playerStats);
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

}