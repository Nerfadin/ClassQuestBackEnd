import admin from "firebase-admin";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import certificate from "../../packages/utils/classquest-2bb7d-b9a69fcf5d24.json";
dayjs.extend(duration);
admin.initializeApp({
  credential: admin.credential.cert(certificate as any), 
});
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();