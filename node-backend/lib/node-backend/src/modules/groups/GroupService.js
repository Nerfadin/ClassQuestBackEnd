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
exports.GroupService = void 0;
const GroupFirebaseAdaptor_1 = require("./GroupFirebaseAdaptor");
const errorUtils_1 = require("../../utils/errorUtils");
const UserService_1 = require("../users/UserService");
const tsyringe_1 = require("../../utils/tsyringe");
let GroupService = class GroupService {
    constructor(groupsDao, userService) {
        this.groupsDao = groupsDao;
        this.userService = userService;
        this.createTeacherProfileGroup = this.groupsDao.createTeacherProfileGroup;
        this.updateGroup = this.groupsDao.updateGroup;
    }
    async addStudentToGroup(studentId, groupId, teacherId) {
        await this.userService.addGroupToPlayer(groupId, studentId);
        await this.groupsDao.addPlayerToGroup(studentId, groupId);
        await this.userService.incrementTeachersScore(teacherId, {
            points: 2,
            studentsCount: 1,
        });
    }
    getGroup(id) {
        return this.groupsDao.getGroup(id);
    }
    async getGroupsIgnoreNotFound(ids) {
        const getGroupOrUndefined = (id) => {
            return this.groupsDao.getGroup(id).catch((e) => {
                if (e instanceof errorUtils_1.EntityNotFoundError)
                    return undefined;
                else
                    throw e;
            });
        };
        const possiblyUndefinedGroups = await Promise.all(ids.map(getGroupOrUndefined));
        const existingGroups = possiblyUndefinedGroups.filter((group) => group);
        return existingGroups;
    }
    async getGroupsQuests(groupId, userId) {
        const quests = await this.groupsDao.getGroupsUnexpiredQuests(groupId);
        const userStats = await this.userService.getPlayerStats(userId);
        const questsWithIsCompleted = quests.map((quest) => (Object.assign(Object.assign({}, quest), { isCompleted: !!userStats.completedQuests[quest.id] })));
        const questsInOrder = questsWithIsCompleted.sort((quest) => quest.isCompleted ? 1 : -1);
        return questsInOrder;
    }
    createGroupWithFixedId(body, teacherId) {
        return this.groupsDao.createGroupWithId(body, teacherId);
    }
    getGroupsByPlayer(playerId) {
        return this.userService
            .getPlayer(playerId)
            .then((player) => this.groupsDao.getGroups(player.groupIds));
    }
    async getGroupsAndQuests(groupId, playerId) {
        const group = await this.groupsDao.getGroup(groupId);
        await this.addStudentToGroup(playerId, groupId, group[0].teacherId);
        // .alwaysRight(); // Caso dê um erro "Player is already in a group"
        const quests = await this.getGroupsQuests(groupId, playerId);
        return {
            group,
            quests,
        };
    }
};
GroupService = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => GroupFirebaseAdaptor_1.GroupFirebaseAdaptor)),
    __param(1, tsyringe_1.Inject(() => UserService_1.UserService)),
    __metadata("design:paramtypes", [GroupFirebaseAdaptor_1.GroupFirebaseAdaptor,
        UserService_1.UserService])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=GroupService.js.map