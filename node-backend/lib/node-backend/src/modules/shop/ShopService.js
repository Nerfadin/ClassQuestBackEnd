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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRndInteger = exports.ShopService = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const ShopFirebaseAdapter_1 = require("./ShopFirebaseAdapter");
const dayjs_1 = __importDefault(require("dayjs"));
let ShopService = class ShopService {
    constructor(shopDao) {
        this.shopDao = shopDao;
    }
    async getShopItems() {
        const shop = await this.shopDao.getShop();
        const expiresIn = dayjs_1.default(shop.nextRefreshAt.toDate()).diff(dayjs_1.default(), "minute"); // quantos minutos faltam
        return Object.assign(Object.assign({}, shop), { expiresIn });
    }
    refreshShop(nextRefreshTime) {
        const idsCount = 33; // 0 - 43
        const itemsCount = 8;
        const selectedIds = Array.from({ length: itemsCount }).map(() => getRndInteger(0, idsCount));
        return this.shopDao.saveShop(selectedIds, nextRefreshTime);
    }
};
ShopService = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => ShopFirebaseAdapter_1.ShopFirebaseAdapter)),
    __metadata("design:paramtypes", [ShopFirebaseAdapter_1.ShopFirebaseAdapter])
], ShopService);
exports.ShopService = ShopService;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRndInteger = getRndInteger;
//# sourceMappingURL=ShopService.js.map