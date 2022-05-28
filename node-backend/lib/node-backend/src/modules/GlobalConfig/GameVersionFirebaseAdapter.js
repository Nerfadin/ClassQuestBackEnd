"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameVersionFirebaseAdapter = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
class GameVersionFirebaseAdapter {
    async getAllowedGameVersion() {
        const gameVersionSnapshot = app_1.adminDb.collection("gameVersion").doc("version").get().catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError ? new errorUtils_1.EntityNotFoundError({
                type: "stat_Not_Found",
                message: "stats_not_found",
                details: err,
            }) : err;
        });
        return (0, firestoreUtils_1.oneDocumentP)(gameVersionSnapshot);
    }
}
exports.GameVersionFirebaseAdapter = GameVersionFirebaseAdapter;
//# sourceMappingURL=GameVersionFirebaseAdapter.js.map