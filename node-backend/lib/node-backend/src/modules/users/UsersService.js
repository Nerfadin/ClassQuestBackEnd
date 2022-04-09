"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUsersService = exports.UsersService = void 0;
const UserFirestoreAdaptor_1 = require("./UserFirestoreAdaptor");
const maybe_1 = require("../../utils/maybe");
const GroupsService_1 = require("../groups/GroupsService");
const app_1 = require("../../app");
const errorUtils_1 = require("../../utils/errorUtils");
class UsersService {
    constructor(userDao, groupsService) {
        this.userDao = userDao;
        this.groupsService = groupsService;
        this.createUserRegisterToken = this.userDao.createUserRegisterToken;
        this.deleteUserRegisterToken = this.userDao.deleteUserRegisterToken;
        this.findUserRegisterToken = this.userDao.findUserRegisterToken;
    }
    savePlayer(playerId, player) {
        return this.userDao
            .savePlayer(playerId, player)
            .mapLeft((err) => new errorUtils_1.UnexpectedError("Erro ao salvar dados", err));
    }
    findPlayer(playerId) {
        return this.userDao.findPlayer(playerId);
    }
    //TODO: not done
    async registerTeacher(registerDto) {
        if (registerDto.token) {
            // const tokenResult = await this.userFirestoreAdaptor.findUserRegisterToken(
            //   registerDto.token
            // );
        }
        (await maybe_1.tryCatch(app_1.adminAuth.createUser({
            email: registerDto.email,
            password: registerDto.password,
            displayName: registerDto.nome,
        }))).map(async (user) => {
            return Promise.all([
                this.userDao.createTeacher({
                    id: user.uid,
                    telefone: registerDto.telefone,
                    email: registerDto.email,
                    nome: registerDto.nome,
                }),
                this.groupsService.createTeacherProfileGroup(user.uid, registerDto.nome),
            ]);
        });
    }
}
exports.UsersService = UsersService;
function buildUsersService() {
    return new UsersService(new UserFirestoreAdaptor_1.UserFirestoreAdaptor(), GroupsService_1.buildGroupsService());
}
exports.buildUsersService = buildUsersService;
//# sourceMappingURL=UsersService.js.map