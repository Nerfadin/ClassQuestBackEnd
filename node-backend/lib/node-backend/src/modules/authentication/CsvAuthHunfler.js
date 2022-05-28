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
exports.AuthenticationService = void 0;
const AuthenticationHttpAdaptor_1 = require("./AuthenticationHttpAdaptor");
const tsyringe_1 = require("../../utils/tsyringe");
const UserService_1 = require("../users/UserService");
const deviceIdAdapter_1 = require("./deviceIdAdapter");
let AuthenticationService = class AuthenticationService {
    constructor(authenticationDao, userService, deviceIdAdapter) {
        this.authenticationDao = authenticationDao;
        this.userService = userService;
        this.deviceIdAdapter = deviceIdAdapter;
        /*   async createAccountWithInstitution(){
             const register = await this.authenticationDao.register();
           }
       */
    }
};
AuthenticationService = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => AuthenticationHttpAdaptor_1.AuthenticationHttpAdaptor)),
    __param(1, tsyringe_1.Inject(() => UserService_1.UserService)),
    __param(2, tsyringe_1.Inject(() => deviceIdAdapter_1.DeviceIdAdapter)),
    __metadata("design:paramtypes", [AuthenticationHttpAdaptor_1.AuthenticationHttpAdaptor,
        UserService_1.UserService,
        deviceIdAdapter_1.DeviceIdAdapter])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=CsvAuthHunfler.js.map