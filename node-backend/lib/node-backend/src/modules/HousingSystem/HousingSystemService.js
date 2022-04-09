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
exports.HouseService = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const HousingErrors_1 = require("./HousingErrors");
const HousingSystemAdapter_1 = require("./HousingSystemAdapter");
let HouseService = class HouseService {
    constructor(houseDao) {
        this.houseDao = houseDao;
    }
    async createHouse(playerId) {
        const house = await this.houseDao.hasHouse(playerId);
        if (!house) {
            const houseCreated = await this.houseDao
                .createHouse(playerId)
                .catch((error) => {
                throw HousingErrors_1.HouseErrors.HouseCreateError(error);
            });
            return houseCreated;
        }
        else {
            throw HousingErrors_1.HouseErrors.HouseAlreadyExist();
        }
    }
    async deleteHouse(playerId) {
        const houseId = await this.houseDao.getHouseId(playerId);
        return this.houseDao.deleteHouse(houseId);
    }
    async getHouse(playerId) {
        const house = await this.houseDao.getHouse(playerId).catch((error) => {
            throw HousingErrors_1.HouseErrors.GetHouseError(error);
        });
        ;
        return house;
    }
    async savePlayerHouse(body) {
        const houseId = await this.houseDao.getHouseId(body.ownerPlayerId);
        return this.houseDao.saveHouse(body, houseId);
    }
};
HouseService = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => HousingSystemAdapter_1.HouseFirebaseAdapter)),
    __metadata("design:paramtypes", [HousingSystemAdapter_1.HouseFirebaseAdapter])
], HouseService);
exports.HouseService = HouseService;
//# sourceMappingURL=HousingSystemService.js.map