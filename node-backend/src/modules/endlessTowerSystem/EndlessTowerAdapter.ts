import { adminDb } from "../../app";
import { EndlessTower,
    CreateTowerDto,
    CreateTowerQuestDto } from "./EndlessTowerDtos";
import { firestore } from "firebase-admin";
import { Singleton } from "../../utils/tsyringe";
import { oneDocumentP } from "../../utils/firestoreUtils";
import { Quest, Question } from "@interfaces/quest";
import { Teacher } from "@interfaces/teacher";
export const TOWERQUESTS = "towerQuestions";
export const TOWER = "endlessTower";
export const QUESTIONLIST = "towerQuestionList";
export const SECURITY = "security";

@Singleton()
export class TowerFirebaseAdapter {
  getTower(towerPin: string) {
    return oneDocumentP<EndlessTower>(
      adminDb.collection(TOWER).doc(towerPin).get()
    );
  }
  createTower(body: CreateTowerDto) {
    const tower = adminDb
      .collection(TOWER)
      .doc(body.towerPin)
      .set({
        towerPin: body.towerPin,
        towerName: body.name,
        institutionId: body.institutionId,
        players: [],
        createdAt: firestore.Timestamp.fromDate(new Date()),
      });
    return tower;
  }
  async createTowerQuestionList(
    subject: string,
    towerId: string,
    institutionId: string,
    questions: Question[],
    teachersIds: string[]
  ) {
    const questionListQuerry = await adminDb
      .collection(TOWERQUESTS)
      .where("towerId", "==", towerId)
      .where("subject", "==", subject)
      .get()
      .then(function (querrySnaptot) {
      querrySnaptot.empty ?
          adminDb.collection(TOWERQUESTS).add({
            questions: questions,
            subject: subject,
            teachers: teachersIds,
            createdAt: firestore.Timestamp.fromDate(new Date()),
            towerId: towerId,
          }): adminDb.collection(TOWERQUESTS)
          .doc(querrySnaptot[0].id)
          .set({
            questions: questions,
            subject: subject,
            teachers: teachersIds,
            createdAt: firestore.Timestamp.fromDate(new Date()),
            towerId: towerId
          });
        }
        );
        return questionListQuerry;      
  }
  static async create(quest: Quest, teacher: Teacher) {
    const questDoc = await adminDb.collection(TOWERQUESTS).add({
      ...quest,
      createdAt: firestore.Timestamp.fromDate(new Date()),  
    });
/*    await InstitutionSerivce.saveTeacherPlan(
      quest.teacherId,
      quest.institutionId,
      {
    //    quests: firebase.firestore.FieldValue.increment(1),
      }
    );*/    
    return questDoc;
  }
  async createTowerQuest (body: CreateTowerQuestDto){
    const quest = await adminDb.collection(TOWERQUESTS).add ({
      ...body,
      towerId: body.towerId,      
    }).then ((firebaseDoc) => {
      firebaseDoc.set({
        questId: firebaseDoc.id
      }, {merge: true});      
    })
    return quest;
  }
  async addQuestToTower(questToAdd: Quest) {
    const towerQuest = adminDb.collection(TOWERQUESTS).doc(questToAdd.id).set ({
      ...questToAdd,
      createdAt: firestore.Timestamp.fromDate(new Date())      
    })
    return towerQuest;    
  }

}
