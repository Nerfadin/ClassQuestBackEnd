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
exports.isNonAnonymousRegister = exports.AuthenticationService = void 0;
const AuthenticationHttpAdaptor_1 = require("./AuthenticationHttpAdaptor");
const tsyringe_1 = require("../../utils/tsyringe");
const UserService_1 = require("../users/UserService");
const deviceIdAdapter_1 = require("./deviceIdAdapter");
const playerBaseStats = {
    email: "",
    firstName: "",
    lastName: "",
    currentHealth: 100,
    maxHealth: 100,
    gender: "",
    playerName: "",
    groupIds: [],
    questIds: [],
    inventory: [],
    level: 1,
    gold: 130,
};
let AuthenticationService = class AuthenticationService {
    constructor(authenticationDao, userService, deviceIdAdapter) {
        this.authenticationDao = authenticationDao;
        this.userService = userService;
        this.deviceIdAdapter = deviceIdAdapter;
        this.refreshToken = this.authenticationDao.refreshToken;
    }
    login(loginDto) {
        return this.authenticationDao.login(loginDto);
    }
    async createDeviceId(playerId) {
        return this.deviceIdAdapter.createDeviceId(playerId);
    }
    async getDeviceId(playerId) {
        return this.deviceIdAdapter.getDeviceCloudId(playerId);
    }
    async registerAnonymously(name) {
        const register = await this.authenticationDao.register();
        await this.userService.savePlayerStats(register.localId, {
            completedQuests: {},
            completedQuestsCount: 0,
        });
        await this.userService.savePlayer(register.localId, Object.assign(Object.assign({}, playerBaseStats), { playerName: name, characterCreated: true }));
        return register;
    }
    async registerStepOne(registerDto) {
        const register = await this.authenticationDao.register(registerDto);
        await this.userService.savePlayerStats(register.localId, {
            completedQuests: {},
            completedQuestsCount: 0,
        });
        await this.userService.savePlayer(register.localId, Object.assign(Object.assign({}, playerBaseStats), { email: registerDto.email, firstName: registerDto.firstName, lastName: registerDto.lastName, characterCreated: false }));
        return register;
    }
    async updateCustomClaims() {
    }
    async RegisterTeacher(email, password) {
        const teacher = await this.authenticationDao.registerTeacher(email, password);
        return teacher;
    }
    async registerPlayerWithInstitution(registerDto, institutionID) {
        const register = await this.authenticationDao.register(registerDto);
        await this.userService.savePlayerStats(register.localId, {
            completedQuests: {},
            completedQuestsCount: 0,
        });
        await this.userService.savePlayer(register.localId, Object.assign(Object.assign({}, playerBaseStats), { email: registerDto.email, firstName: registerDto.firstName, lastName: registerDto.lastName, characterCreated: false }));
        return register;
    }
    registerStepTwo(registerDto, userId) {
        return this.userService
            .savePlayer(userId, {
            playerName: registerDto.playerName,
            gender: registerDto.gender,
            characterCreated: true,
        })
            .then(() => this.userService.getPlayer(userId));
    }
};
AuthenticationService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => AuthenticationHttpAdaptor_1.AuthenticationHttpAdaptor)),
    __param(1, (0, tsyringe_1.Inject)(() => UserService_1.UserService)),
    __param(2, (0, tsyringe_1.Inject)(() => deviceIdAdapter_1.DeviceIdAdapter)),
    __metadata("design:paramtypes", [AuthenticationHttpAdaptor_1.AuthenticationHttpAdaptor,
        UserService_1.UserService,
        deviceIdAdapter_1.DeviceIdAdapter])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
function isNonAnonymousRegister(obj) {
    return obj.email && obj.password;
}
exports.isNonAnonymousRegister = isNonAnonymousRegister;
//# sourceMappingURL=AuthenticationService.js.map