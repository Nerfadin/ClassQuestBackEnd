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
exports.ConfigService = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const ConfigFirebaseAdapter_1 = require("./ConfigFirebaseAdapter");
let ConfigService = class ConfigService {
    constructor(configService) {
        this.configService = configService;
        this.getConfig = this.configService.getConfigs;
    }
};
ConfigService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => ConfigFirebaseAdapter_1.ConfigFirebaseAdapter)),
    __metadata("design:paramtypes", [ConfigFirebaseAdapter_1.ConfigFirebaseAdapter])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map