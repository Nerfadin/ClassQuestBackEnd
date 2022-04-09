import { GroupFirebaseAdaptor } from "./GroupFirebaseAdaptor";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { UserService } from "../users/UserService";
import { Singleton, Inject } from "../../utils/tsyringe";
import { Group } from "../../../../packages/interfaces/groups";
import {createGroupWithIdDto} from './GroupFirebaseAdaptor'
@Singleton()
export class GroupService {
  constructor(
    @Inject(() => GroupFirebaseAdaptor) private groupsDao: GroupFirebaseAdaptor,
    @Inject(() => UserService) private userService: UserService
  ) {}
  createTeacherProfileGroup = this.groupsDao.createTeacherProfileGroup;
  updateGroup = this.groupsDao.updateGroup;

  async addStudentToGroup(
    studentId: string,
    groupId: string,
    teacherId: string
  ) {
    await this.userService.addGroupToPlayer(groupId, studentId);

    await this.groupsDao.addPlayerToGroup(studentId, groupId);
    await this.userService.incrementTeachersScore(teacherId, {
      points: 2,
      studentsCount: 1,
    });
  }
  getGroup(id: string) {
    return this.groupsDao.getGroup(id);
  }
  async getGroupsIgnoreNotFound(ids: string[]) {
    const getGroupOrUndefined = (id: string) => {
      return this.groupsDao.getGroup(id).catch((e) => {
        if (e instanceof EntityNotFoundError) return undefined;
        else throw e;
      });
    };
    const possiblyUndefinedGroups = await Promise.all(
      ids.map(getGroupOrUndefined)
    );
    const existingGroups = possiblyUndefinedGroups.filter(
      (group) => group
    ) as Group[];

    return existingGroups;
  }

  async getGroupsQuests(groupId: string, userId: string) {
    const quests = await this.groupsDao.getGroupsUnexpiredQuests(groupId);

    const userStats = await this.userService.getPlayerStats(userId);

    const questsWithIsCompleted = quests.map((quest) => ({
      ...quest,
      isCompleted: !!userStats.completedQuests[quest.id],
    }));        
    const questsInOrder = questsWithIsCompleted.sort((quest) =>
      quest.isCompleted ? 1 : -1
    );
    return questsInOrder;
  }
  createGroupWithFixedId(body: createGroupWithIdDto, teacherId: string){
    return this.groupsDao.createGroupWithId(body, teacherId);
  }
  getGroupsByPlayer(playerId: string) {
    return this.userService
      .getPlayer(playerId)
      .then((player) => this.groupsDao.getGroups(player.groupIds));
  }
  async getGroupsAndQuests(groupId: string, playerId: string) {
    const group = await this.groupsDao.getGroup(groupId);
    await this.addStudentToGroup(playerId, groupId, group[0].teacherId);
    // .alwaysRight(); // Caso dê um erro "Player is already in a group"
    const quests = await this.getGroupsQuests(groupId, playerId);
    return {
      group,
      quests,
    };
  }
}
