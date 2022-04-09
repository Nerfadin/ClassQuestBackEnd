"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsFirebaseAdaptor = exports.PLAYERS = void 0;
const app_1 = require("../../app");
const maybe_1 = require("../../utils/maybe");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const GroupsFirebaseAdaptor_1 = require("../groups/GroupsFirebaseAdaptor");
exports.PLAYERS = "players";
class QuestsFirebaseAdaptor {
    submitAnswer(answer, userId) {
        return maybe_1.tryCatch(app_1.adminDb
            .collection(exports.PLAYERS)
            .doc(userId)
            .collection("answers")
            .doc(answer.questId)
            .set(answer));
    }
    findAnswer(userId, questId) {
        return firestoreUtils_1.oneDocumentOrError(app_1.adminDb
            .collection(exports.PLAYERS)
            .doc(userId)
            .collection("answers")
            .doc(questId)
            .get());
    }
    findQuest(questId) {
        return firestoreUtils_1.oneDocumentOrError(app_1.adminDb.collection(GroupsFirebaseAdaptor_1.QUESTS_IN_GROUPS).doc(questId).get());
    }
    updateQuest(questId, updateDto) {
        return maybe_1.tryCatch(app_1.adminDb.collection(GroupsFirebaseAdaptor_1.QUESTS_IN_GROUPS).doc(questId).update(updateDto));
    }
}
exports.QuestsFirebaseAdaptor = QuestsFirebaseAdaptor;
//# sourceMappingURL=QuestsFirebaseAdaptor.js.map