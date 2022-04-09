import { adminDb } from "../../app";
import {
  UpdateFirestoreDocument,
  oneDocumentP,
  manyDocumentsOrErrorP,
} from "../../utils/firestoreUtils";
import { QuestInGroup, QuestInGroupDto } from "@interfaces/groups";
import { QUESTS_IN_GROUPS } from "../groups/GroupFirebaseAdaptor";
import { questInGroupFirestoreToQuestInGroupDto } from "./converters/questFirestoreToQuestDto";
import { Singleton } from "../../utils/tsyringe";
import { AnswerDto } from "../../../../packages/interfaces/routes/AnswerDto";
import { Quest } from "@interfaces/quest";
export const PLAYERS = "players";
export const QUESTS = "quests";
export const ANSWERS = "answers";
@Singleton()
export class QuestFirebaseAdaptor {
  saveAnswer(answer: AnswerDto, userId: string) {
    return adminDb
      .collection(PLAYERS)
      .doc(userId)
      .collection("answers")
      .doc(answer.questId)
      .set(answer);
  }
  getAnswer(userId: string, questId: string) {
    return oneDocumentP<AnswerDto>(
      adminDb
        .collection(PLAYERS)
        .doc(userId)
        .collection("answers")
        .doc(questId)
        .get()
    );
  }
  getQuestByScore (playerId: string, minimumscore){
    return manyDocumentsOrErrorP <Quest> (
    adminDb.collection(PLAYERS).
    doc(playerId).
    collection(ANSWERS).
    where("score", "<=", minimumscore)
    .get()).then ((quests) => quests.map (questInGroupFirestoreToQuestInGroupDto));
  }

  getQuest(questId: string) {
    return oneDocumentP<QuestInGroup>(
      adminDb.collection(QUESTS_IN_GROUPS).doc(questId).get()
    ).then(questInGroupFirestoreToQuestInGroupDto);
  }

  getPublishedQuests(teacherId: string) {
    return manyDocumentsOrErrorP<QuestInGroup>(
      adminDb
        .collection(QUESTS_IN_GROUPS)
        .where("teacherId", "==", teacherId)
        .get()
    ).then((quests) => quests.map(questInGroupFirestoreToQuestInGroupDto));
  }

  updateQuestInGroup(
    questId: string,
    updateDto: UpdateFirestoreDocument<QuestInGroupDto>
  ) {
    // TODO: database has been saving them as QuestInGroupDto because it was `any`. See if this is causing any errors
    return adminDb.collection(QUESTS_IN_GROUPS).doc(questId).update(updateDto);
  }
}
