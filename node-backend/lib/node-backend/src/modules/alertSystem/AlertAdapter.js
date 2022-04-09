"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertFirebaseAdapter = exports.CONFIG = exports.ALERTCONFIG = exports.ALERTS = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
exports.ALERTS = "alerts";
exports.ALERTCONFIG = "alertConfig";
exports.CONFIG = "Config";
class AlertFirebaseAdapter {
    getAlertConfig() {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb
            .collection(exports.CONFIG)
            .doc(exports.ALERTCONFIG)
            .get());
    }
    async fetchActiveAlerts() {
        return firestoreUtils_1.manyDocuments(await app_1.adminDb
            .collection(exports.ALERTS)
            .get());
    }
}
exports.AlertFirebaseAdapter = AlertFirebaseAdapter;
//# sourceMappingURL=AlertAdapter.js.map