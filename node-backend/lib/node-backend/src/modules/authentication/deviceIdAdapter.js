"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceIdAdapter = void 0;
const app_1 = require("../../app");
const generatePin_1 = require("../../utils/generatePin");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
class DeviceIdAdapter {
    async createDeviceId(playerId) {
        const deviceId = generatePin_1.generateDeviceId();
        await app_1.adminDb
            .collection("players")
            .doc(playerId)
            .set({ deviceId: deviceId }, { merge: true });
        return deviceId;
    }
    async getDeviceCloudId(playerId) {
        const player = await firestoreUtils_1.oneDocumentP(app_1.adminDb.collection("players").doc(playerId).get());
        return player.deviceId;
    }
}
exports.DeviceIdAdapter = DeviceIdAdapter;
//# sourceMappingURL=deviceIdAdapter.js.map