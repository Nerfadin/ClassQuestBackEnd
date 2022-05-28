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
exports.UserService = void 0;
const UserFirestoreAdaptor_1 = require("./UserFirestoreAdaptor");
const errorUtils_1 = require("../../utils/errorUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const UserErrors_1 = require("./UserErrors");
let UserService = class UserService {
    constructor(userDao // @Inject(() => GroupService) private groupsService: GroupService
    ) {
        this.userDao = userDao;
        this.createUserRegisterToken = this.userDao.createUserRegisterToken;
        this.deleteUserRegisterToken = this.userDao.deleteUserRegisterToken;
        this.getUserRegisterToken = this.userDao.getUserRegisterToken;
        this.incrementTeachersScore = this.userDao.incrementTeacherValues;
        this.savePlayerStats = this.userDao.savePlayerStats;
    }
    getPlayerStats(id) {
        return this.userDao.getPlayerStats(id).catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError
                ? UserErrors_1.UserErrors.UserStatsNotFoundError(err)
                : err;
        });
    }
    async savePlayer(playerId, update) {
        return await this.userDao.savePlayer(playerId, update).catch((err) => {
            throw UserErrors_1.UserErrors.FailedToSavePlayer(err);
        });
    }
    addGroupToPlayer(groupId, playerId) {
        return this.userDao.savePlayer(playerId, {
            groupIds: firebase_admin_1.default.firestore.FieldValue.arrayUnion(groupId),
        });
    }
    getPlayer(playerId) {
        return this.userDao.getPlayer(playerId).catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError
                ? UserErrors_1.UserErrors.UserNotFoundError(err)
                : err;
        });
    }
    getTeacher(teacherId) {
        return this.userDao.getTeacher(teacherId).catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError
                ? UserErrors_1.UserErrors.TeacherNotFoundError(err)
                : err;
        });
    }
};
UserService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => UserFirestoreAdaptor_1.UserFirestoreAdaptor)),
    __metadata("design:paramtypes", [UserFirestoreAdaptor_1.UserFirestoreAdaptor // @Inject(() => GroupService) private groupsService: GroupService
    ])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map