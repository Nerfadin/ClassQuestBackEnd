"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFirebaseAdapter = exports.LOGS = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
exports.LOGS = "Logs";
class LogFirebaseAdapter {
    async saveLog(log) {
        const doc = await app_1.adminDb.collection(exports.LOGS).add(log);
        return await app_1.adminDb.collection(exports.LOGS).doc(doc.id).get();
    }
    async getLogByUser(userId) {
        return await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.
            collection(exports.LOGS)
            .where("userId", "==", userId)
            .get());
    }
}
exports.LogFirebaseAdapter = LogFirebaseAdapter;
//# sourceMappingURL=logFirebaseAdapter.js.map