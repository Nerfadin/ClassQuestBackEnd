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
exports.PlayerStatsService = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const PlayerStatsAdapter_1 = require("./PlayerStatsAdapter");
let PlayerStatsService = class PlayerStatsService {
    constructor(playerDao) {
        this.playerDao = playerDao;
    }
    async createPlayerStats(playerId) {
        await this.playerDao.createPlayerStats(playerId);
    }
    async savePlayerStats(playerId, playerStats) {
        return await this.playerDao.savePlayerStats(playerId, playerStats);
    }
    async getPlayerStats(playerId) {
        return await this.playerDao.getPlayerStats(playerId).catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError
                ? new errorUtils_1.EntityNotFoundError({
                    type: "stats_not_Found",
                    message: "O jogador não possuí stats ainda",
                    details: err,
                })
                : err;
        });
    }
};
PlayerStatsService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => PlayerStatsAdapter_1.PlayerStatsAdapter)),
    __metadata("design:paramtypes", [PlayerStatsAdapter_1.PlayerStatsAdapter])
], PlayerStatsService);
exports.PlayerStatsService = PlayerStatsService;
//# sourceMappingURL=PlayerStatsService.js.map