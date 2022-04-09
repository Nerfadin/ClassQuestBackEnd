"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolOfficeFirebaseAdaptor = exports.INSTITUTION_HAS_OWNER = exports.OWNER_HAS_TEACHER = void 0;
const app_1 = require("src/app");
//import { manyDocumentsOrErrorP } from "../../utils/firestoreUtils";
exports.OWNER_HAS_TEACHER = "owner_has_teacher";
exports.INSTITUTION_HAS_OWNER = "owner_has_institution";
class SchoolOfficeFirebaseAdaptor {
    async getUserOwners() {
    }
    async isTeacherOwned(teacherId, ownerId) {
        const snapshop = await app_1.adminDb.collection(exports.OWNER_HAS_TEACHER).where("owner", "==", ownerId).where("teacher", "==", teacherId).get();
        snapshop.empty ? false : true;
    }
    async createOwnership(teacherId, ownerId) {
        const ownershipRelation = await app_1.adminDb.collection(exports.OWNER_HAS_TEACHER).add({
            teacher: teacherId,
            owner: ownerId
        });
        return ownershipRelation;
    }
    async deleteTeacherOwnership(teacherId, ownerId) {
        const snapshop = await app_1.adminDb.collection(exports.OWNER_HAS_TEACHER).where("owner", "==", ownerId).where("teacher", "==", teacherId).get();
        // const relations = manyDocumentsOrErrorP<T>(snapshop);
        snapshop.docs.map(async (doc) => {
            await app_1.adminDb.collection(exports.OWNER_HAS_TEACHER).doc(doc.id).delete();
        });
    }
}
exports.SchoolOfficeFirebaseAdaptor = SchoolOfficeFirebaseAdaptor;
//# sourceMappingURL=schoolOfficeFirebaseAdaptor.js.map