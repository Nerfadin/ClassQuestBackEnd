import { adminDb } from "../../app";

import { LoginPayload } from "./models/LoginDto";
import { generateDeviceId } from "../../utils/generatePin";
import { oneDocumentP } from "../../utils/firestoreUtils";
export class DeviceIdAdapter {
  async createDeviceId(playerId: string) {
    const deviceId = generateDeviceId();
    await adminDb
      .collection("players")
      .doc(playerId)
      .set({ deviceId: deviceId }, { merge: true });
    return deviceId;
  }
  async getDeviceCloudId(playerId: string) {
    const player = await oneDocumentP<LoginPayload>(
      adminDb.collection("players").doc(playerId).get()
    );
    return player.deviceId;
  }
}
