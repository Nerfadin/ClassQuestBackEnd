import { adminDb } from "../../app";
import { manyDocumentsOrErrorP, oneDocumentP } from "../../utils/firestoreUtils";
import { Quest } from "@interfaces/quest";
import { Teacher } from "@interfaces/teacher";
import { Singleton } from "../../utils/tsyringe";
import { INSTITUTION_HAS_QUESTS } from '../../modules/institutions/InstitutionFirestoreAdaptor';


/**  TODO
 *  criar relação entre quest e institution 
*/
//quest Id for testing: DOgB9Z
@Singleton()
export class QuestMigrator {

  async getAllQuests() {
    const quests = await manyDocumentsOrErrorP<Quest>(
      adminDb.collection("quests").get()
    );
    console.log(quests.length);
    return quests;

  }
  async getAllQuestsFromTeacher(teacherId: string) {
    const questsFromTeacher = await manyDocumentsOrErrorP<Quest>(
      adminDb.collection("quests").where("teacherId", "==", teacherId).get());
    console.log(questsFromTeacher.length);
    return questsFromTeacher;
  }

  async getTeacher(teacherId) {
    oneDocumentP<Teacher>(adminDb.collection("teachers").doc(teacherId).get());
  }
  async migrateAllQuests() {
    const allquests = await this.getAllQuests();
    console.log(allquests.length);

    allquests.map(async (quest) => {
      if (quest.id != null || quest.id != undefined) {
        await this.getOneQuestAndAddTeacherField(quest.id);
        console.log("quest updated" + quest.id)
      } else {
        console.log(quest);
      }
    })
  }
  async createQuestRelationshipWithInstitution() {
    const quests = await this.getAllQuests();
    quests.map(async (quest) => {
      adminDb.collection(INSTITUTION_HAS_QUESTS).add({
        institutionIds: quest.institutionId,
        questId: quest.id
      })
    });
    //    const quests = await this.getAllQuests()
  }
  async insertTeacherInDocument(questId: string, teacherName: string) {
    adminDb.collection("quests").doc(questId).set(
      {
        teacherName: teacherName,
      },
      { merge: true }
    );
  }
  async getOneQuestAndAddTeacherField(questId: string) {
    const quest = await oneDocumentP<Quest>(
      adminDb.collection("quests").doc(questId).get()
    );
    console.log(quest.title);
    const teacher = await oneDocumentP<Teacher>(
      adminDb.collection("teachers").doc(quest.teacherId).get()
    );
    await adminDb.collection("quests").doc(questId).set({
      teacherName: teacher.nome,
    }, { merge: true });
    return await oneDocumentP<Quest>(adminDb.collection("quests").doc(questId).get());
  }
}
