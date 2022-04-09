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
exports.PlayerInventoryService = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const PlayerInventoryAdapter_1 = require("./PlayerInventoryAdapter");
let PlayerInventoryService = class PlayerInventoryService {
    constructor(playerInventoryDao) {
        this.playerInventoryDao = playerInventoryDao;
    }
    async savePlayerInventoryComplete(body) {
        if (body.updateGold) {
            await this.playerInventoryDao.addGoldToPlayer(body.playerId, body.goldAmount);
            console.log("gold");
        }
        if (body.updateHouseInventory) {
            await this.playerInventoryDao.savePlayerHouseInventory(body.playerHouseInventory, body.playerId);
            console.log("House");
        }
        if (body.updatePlayerInventory) {
            await this.playerInventoryDao.savePlayerInventory(body);
            console.log("playerInventory");
        }
        if (body.updateHouseChest) {
            await this.playerInventoryDao.savePlayerChest(body.playerId, body.playerHouseChest);
        }
        return this.playerInventoryDao.getPlayerInventory(body.playerId);
    }
    async getPlayerInventory(playerId) {
        return this.playerInventoryDao.getPlayerInventory(playerId).catch(() => {
            return null;
        });
    }
    async addGoldToPlayer(playerId, goldAmount) {
        return this.playerInventoryDao
            .addGoldToPlayer(playerId, goldAmount)
            .catch(() => {
            return null;
        });
    }
    async updatePlayerGold(playerId, goldAmount) {
        await this.playerInventoryDao.updateGold(playerId, goldAmount);
    }
    deletePlayerInventory(playerId) {
        return this.playerInventoryDao.deletePlayerInventory(playerId);
    }
};
PlayerInventoryService = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => PlayerInventoryAdapter_1.PlayerInventoryAdapter)),
    __metadata("design:paramtypes", [PlayerInventoryAdapter_1.PlayerInventoryAdapter])
], PlayerInventoryService);
exports.PlayerInventoryService = PlayerInventoryService;
//# sourceMappingURL=PlayerInventoryService.js.map