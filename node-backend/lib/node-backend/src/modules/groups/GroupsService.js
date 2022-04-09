"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGroupsService = exports.GroupsService = void 0;
const GroupsFirebaseAdaptor_1 = require("./GroupsFirebaseAdaptor");
const errorUtils_1 = require("../../utils/errorUtils");
class GroupsService {
    constructor(groupsDao) {
        this.groupsDao = groupsDao;
        this.createTeacherProfileGroup = this.groupsDao.createTeacherProfileGroup;
    }
    findGroupsQuests(groupId) {
        return this.groupsDao
            .findGroup(groupId)
            .mapLeft((err) => new errorUtils_1.EntityNotFoundError("Grupo não encontrado", err))
            .chain((group) => this.groupsDao
            .findGroupsQuests(groupId)
            .map((quests) => ({ group, quests })));
    }
}
exports.GroupsService = GroupsService;
function buildGroupsService() {
    return new GroupsService(new GroupsFirebaseAdaptor_1.GroupsFirebaseAdaptor());
}
exports.buildGroupsService = buildGroupsService;
//# sourceMappingURL=GroupsService.js.map