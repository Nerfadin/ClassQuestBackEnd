import { oneDocumentP } from "../../utils/firestoreUtils";
import { adminDb } from "../../app";
import { PlayerStat, PlayerStats } from "./StatsDtos";
import { Singleton } from "../../utils/tsyringe";
const STATS = "characterStats";

@Singleton()
export class PlayerStatsAdapter {
    getPlayerStats(playerId: string) {
        const playerStatsSnap = adminDb.collection(STATS).doc(playerId).get();
        return oneDocumentP<PlayerStat>(playerStatsSnap);
      }
      savePlayerStats(playerId: string, playerStats: PlayerStats) {
        return adminDb.collection(STATS).doc(playerId).set({ playerStats });        
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
}