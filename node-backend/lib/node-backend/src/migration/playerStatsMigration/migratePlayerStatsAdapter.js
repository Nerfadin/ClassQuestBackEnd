"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMigration = void 0;
//import { manyDocuments } from "../../utils/firestoreUtils";
const class_validator_1 = require("class-validator");
const app_1 = require("../../app");
const tsyringe_1 = require("../../utils/tsyringe");
//import { Player } from "@interfaces/player";
const PlayerFirebaseAdapter_1 = require("../../modules/Players/PlayerFirebaseAdapter");
const PLAYERS = "players";
const playersWithStats = ["25R9xNNruRbWTPAGiYNSS81zyL43",
    "JkM8VQEk9SS6vbP5CyywVxPxsvi1",
    "PzmEnnUfWzQtU6ijfaCiR7sLOJv1",
    "RIhcLov5Hph70R9QxlXaKf5S2tE3",
    "aRYofnHLXCgcQOeyuCHUIW8id0y2",
    "gGdf1pnidCTXkqwjfyyqsUwOxWn1",
    "i9qvhzheamagXEcw2j2wBXtVuBp1",
    "iY5mypJ3Wwd4i2MSE6WFexqAEsp1",
    "pSOBdK0PK8X13clm8D5947MBfgI2",
    "udq9P2UPjbYAYqhFMg1OaQPY4HV2",
    "ycIlSnwK74SoupjpGBeZGYCD7tj2"];
//const CHARACTERSTATS = "characterStats";
let PlayerMigration = class PlayerMigration {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async LoopAndCreateStats() {
        const playersWithStats = await app_1.adminDb.collection(PLAYERS).get().then((characterStats) => {
            return characterStats.docs.map(async (playerId) => {
                await this.createPlayerStats(playerId.id);
            });
        });
        return playersWithStats;
    }
    async createPlayerStats(playerId) {
        if (!class_validator_1.arrayContains(playersWithStats, [playerId])) {
            await this.playerService.createPlayerStats(playerId);
        }
    }
};
PlayerMigration = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => PlayerFirebaseAdapter_1.PlayerFirebaseAdapter)),
    __metadata("design:paramtypes", [PlayerFirebaseAdapter_1.PlayerFirebaseAdapter])
], PlayerMigration);
exports.PlayerMigration = PlayerMigration;
/*    async createPlayerStatForEveryPlayer(){
    await adminDb.collection(PLAYERS).get().then ((player) => {
      const p = manyDocuments<Player> (player);
      try{
          const stat = async() =>{ await this.playerService.getPlayerStats(p[0].id)}
            if (stat == null){
                console.log (p[0].id);
                console.log(p[0].playerName);
                
            }
        }catch(err) {
                console.log ("inside catch"+ err)
      }
      return p;
              this.playerService.createPlayerStats(player[0].id)
      
   })
}
}*/ 
//# sourceMappingURL=migratePlayerStatsAdapter.js.map