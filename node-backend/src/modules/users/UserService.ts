import { UserFirestoreAdaptor } from "./UserFirestoreAdaptor";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { Player } from "../../../../packages/interfaces/player";
import { Inject, Singleton } from "../../utils/tsyringe";
import { UpdateFirestoreDocument } from "../../utils/firestoreUtils";
import admin from "firebase-admin";
import { UserErrors } from "./UserErrors";

@Singleton()
export class UserService {
  constructor(
    @Inject(() => UserFirestoreAdaptor) private userDao: UserFirestoreAdaptor // @Inject(() => GroupService) private groupsService: GroupService
  ) {}

  createUserRegisterToken = this.userDao.createUserRegisterToken;

  deleteUserRegisterToken = this.userDao.deleteUserRegisterToken;

  getUserRegisterToken = this.userDao.getUserRegisterToken;

  incrementTeachersScore = this.userDao.incrementTeacherValues;

  savePlayerStats = this.userDao.savePlayerStats;

  getPlayerStats(id: string) {
    return this.userDao.getPlayerStats(id).catch((err) => {
      throw err instanceof EntityNotFoundError
        ? UserErrors.UserStatsNotFoundError(err)
        : err;
    });
  }

  async savePlayer(playerId: string, update: UpdateFirestoreDocument<Player>) {
    return await this.userDao.savePlayer(playerId, update).catch((err) => {
      throw UserErrors.FailedToSavePlayer(err);
    });
  }

  addGroupToPlayer(groupId: string, playerId: string) {
    return this.userDao.savePlayer(playerId, {
      groupIds: admin.firestore.FieldValue.arrayUnion(groupId),
    });
  }
  getPlayer(playerId: string) {
    return this.userDao.getPlayer(playerId).catch((err) => {
      throw err instanceof EntityNotFoundError
        ? UserErrors.UserNotFoundError(err)
        : err;
    });
  }

  getTeacher(teacherId: string) {
    return this.userDao.getTeacher(teacherId).catch((err) => {
      throw err instanceof EntityNotFoundError
        ? UserErrors.TeacherNotFoundError(err)
        : err;
    });
  }

  // TODO: not done
  // async registerTeacher(registerDto: RegisterTeacherDto) {
  //   if (registerDto.token) {
  //     // const tokenResult = await this.userFirestoreAdaptor.getUserRegisterToken(
  //     //   registerDto.token
  //     // );
  //   }
  //   (
  //     await tryCatch(
  //       adminAuth.createUser({
  //         email: registerDto.email,
  //         password: registerDto.password,
  //         displayName: registerDto.nome,
  //       })
  //     )
  //   ).map(async (user) => {
  //     return Promise.all([
  //       this.userDao.createTeacher({
  //         id: user.uid,
  //         telefone: registerDto.telefone,
  //         email: registerDto.email,
  //         nome: registerDto.nome,
  //       }),
  //       this.groupsService.createTeacherProfileGroup(
  //         user.uid,
  //         registerDto.nome
  //       ),
  //       // InstitutionSerivce.create(
  //       //   {
  //       //     name: register.instituicao.length
  //       //       ? register.instituicao
  //       //       : register.nome,
  //       //   },
  //       //   user.user!.uid
  //       // ),
  //       // TeachersService.createBaseSecurity(user.user?.uid!),
  //     ]);
  //   });
  // }
}
