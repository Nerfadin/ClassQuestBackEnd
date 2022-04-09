import { adminDb } from "../../app";
import { generatePin } from "../../utils/generatePin";
import {
  UpdateFirestoreDocument,
  manyDocumentsOrErrorP,
  oneDocumentP
} from "../../utils/firestoreUtils";
import { Group, QuestInGroup } from "../../../../packages/interfaces/groups";
import { questInGroupFirestoreToQuestInGroupDto } from "../quests/converters/questFirestoreToQuestDto";
import { Singleton } from "../../utils/tsyringe";
import { firestore } from "firebase-admin";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { Player } from "@interfaces/player";

export type createGroupWithIdDto = {
     avaregeScore: number,
     id: string,
     pin: string,
     players: Player[],
    questCount: number,
    subject: string[],
    messages: string[],


}
export const GROUPS = "groups";
export const QUESTS_IN_GROUPS = "quests";
export const TEACHERS = "teachers";
@Singleton()
export class GroupFirebaseAdaptor {
  addPlayerToGroup(studentId: string, groupId: string) {
    return adminDb
      .collection(GROUPS)
      .doc(groupId)
      .update({
        players: firestore.FieldValue.arrayUnion(studentId),
        playersCount: firestore.FieldValue.increment(1),
      });
  }
  updateGroup(questId: string, updateDto: UpdateFirestoreDocument<Group>) {
    return adminDb.collection(GROUPS).doc(questId).update(updateDto);
  }
  async getGroupsUnexpiredQuests(groupId: string) {
    const now = new Date();
    const unexpiredQuests = adminDb
      .collection(QUESTS_IN_GROUPS)
      .where("groupId", "==", groupId)
      .where("dataExpiracao", ">", now);
    const questsWithoutExpirationDate = adminDb
      .collection(QUESTS_IN_GROUPS)
      .where("groupId", "==", groupId)
      .where("dataExpiracao", "==", null);
    const [a, b] = await Promise.all([
      manyDocumentsOrErrorP<QuestInGroup>(unexpiredQuests.get()),
      manyDocumentsOrErrorP<QuestInGroup>(questsWithoutExpirationDate.get()),
    ]);
    return b.concat(a).map(questInGroupFirestoreToQuestInGroupDto);
  }
  async createGroupWithId (body: createGroupWithIdDto, teacherId: string){
    const group = await adminDb.collection(GROUPS).doc(body.id).set ({
      avaregeScore: 0,
      description: "",
      id: body.id,
      players: [],
      playesCount: 0,
      questCount: 0,
      subjects: [body.subject],
      messages: [],
      teacherId: teacherId,
      subject: body.subject,
      studentsAnswred:0 
    })
    return group
  }
  
  getGroup(id: string) {
    return oneDocumentP<Group>(adminDb.collection(GROUPS).doc(id).get()).catch(
      async(err) => {
        throw err instanceof EntityNotFoundError
          ? new EntityNotFoundError({
            type: "group_not_found",
            message: "Grupo não encontrado",
            details: err,
          })
          : err;
      });    
  }


  
  // gets a list of groups, ignores undefined groups
  async getGroups(ids: string[]) {
    const docRefs = ids.map((id) => adminDb.collection(GROUPS).doc(id));
    const firestoreGroups = await Promise.all(
      docRefs.map((d) =>
        oneDocumentP<Group>(d.get()).catch((_err) => undefined)
      )
    );
    const existingGroups = firestoreGroups.filter(
      (group) => !!group
    ) as Group[];
    return existingGroups;
  }

  createTeacherProfileGroup(id: string, name: string) {
    return adminDb
      .collection(GROUPS)
      .doc(id)
      .set({
        id,
        pin: generatePin(),
        teacher: adminDb.collection(TEACHERS).doc(id),
        name,
        description: "",
        subject: ["Perfil"],
        questsCount: 0,
      });
  }
}
