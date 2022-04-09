"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestFirebaseAdaptor = exports.ANSWERS = exports.QUESTS = exports.PLAYERS = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const GroupFirebaseAdaptor_1 = require("../groups/GroupFirebaseAdaptor");
const questFirestoreToQuestDto_1 = require("./converters/questFirestoreToQuestDto");
const tsyringe_1 = require("../../utils/tsyringe");
exports.PLAYERS = "players";
exports.QUESTS = "quests";
exports.ANSWERS = "answers";
let QuestFirebaseAdaptor = class QuestFirebaseAdaptor {
    saveAnswer(answer, userId) {
        return app_1.adminDb
            .collection(exports.PLAYERS)
            .doc(userId)
            .collection("answers")
            .doc(answer.questId)
            .set(answer);
    }
    getAnswer(userId, questId) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb
            .collection(exports.PLAYERS)
            .doc(userId)
            .collection("answers")
            .doc(questId)
            .get());
    }
    getQuestByScore(playerId, minimumscore) {
        return firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb.collection(exports.PLAYERS).
            doc(playerId).
            collection(exports.ANSWERS).
            where("score", "<=", minimumscore)
            .get()).then((quests) => quests.map(questFirestoreToQuestDto_1.questInGroupFirestoreToQuestInGroupDto));
    }
    getQuest(questId) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(GroupFirebaseAdaptor_1.QUESTS_IN_GROUPS).doc(questId).get()).then(questFirestoreToQuestDto_1.questInGroupFirestoreToQuestInGroupDto);
    }
    getPublishedQuests(teacherId) {
        return firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb
            .collection(GroupFirebaseAdaptor_1.QUESTS_IN_GROUPS)
            .where("teacherId", "==", teacherId)
            .get()).then((quests) => quests.map(questFirestoreToQuestDto_1.questInGroupFirestoreToQuestInGroupDto));
    }
    updateQuestInGroup(questId, updateDto) {
        // TODO: database has been saving them as QuestInGroupDto because it was `any`. See if this is causing any errors
        return app_1.adminDb.collection(GroupFirebaseAdaptor_1.QUESTS_IN_GROUPS).doc(questId).update(updateDto);
    }
};
QuestFirebaseAdaptor = __decorate([
    tsyringe_1.Singleton()
], QuestFirebaseAdaptor);
exports.QuestFirebaseAdaptor = QuestFirebaseAdaptor;
//# sourceMappingURL=QuestFirebaseAdaptor.js.map