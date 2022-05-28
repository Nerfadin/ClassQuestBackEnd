"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerFirebaseAdapter = exports.OWNEDINSTITUTIONS = exports.OWNER = void 0;
const app_1 = require("../../../app");
const tsyringe_1 = require("../../../utils/tsyringe");
const firebase_admin_1 = require("firebase-admin");
exports.OWNER = "owner";
exports.OWNEDINSTITUTIONS = "ownedInstitution";
let OwnerFirebaseAdapter = class OwnerFirebaseAdapter {
    async getOwnerInstitutions(ownerId) {
        const ownedInstitutions = await app_1.adminDb.collection(exports.OWNER).doc(ownerId).collection(exports.OWNEDINSTITUTIONS).get();
        return ownedInstitutions.docs.map((i) => {
            return i.data;
        });
    }
    async CreateOwner(owner) {
        const ownerId = await app_1.adminDb.collection(exports.OWNER).add(Object.assign(Object.assign({}, owner), { CreatedAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()), ownerBillingDate: firebase_admin_1.firestore.Timestamp.fromDate(new Date()) }));
        return (await app_1.adminDb.collection(exports.OWNER).where("ownerId", "==", ownerId.id).get()).docs[0];
    }
    async UpdateOwnerStatistics(ownerId, updateStatistics) {
        await app_1.adminDb.collection(exports.OWNER).doc(ownerId).update({
            quests: updateStatistics.questCountAdd,
            teachers: updateStatistics.teacherCountAdd,
            players: updateStatistics.playerCountAdd
        });
    }
    //institution A: QHISBM5KryaXQHmPNc2I
    //institution B: UrbAWDBVjXBks92Hy3S1
    //institution C: GnsZj4Ywiwy56SIKdTUn
    async addInstitutionToOwner(ownerId, institutionId) {
        await app_1.adminDb.collection(exports.OWNER).doc(ownerId).collection(exports.OWNEDINSTITUTIONS).doc(institutionId).set({
            institutionId: institutionId,
            ownerId: ownerId,
        });
    }
};
OwnerFirebaseAdapter = __decorate([
    (0, tsyringe_1.Singleton)()
], OwnerFirebaseAdapter);
exports.OwnerFirebaseAdapter = OwnerFirebaseAdapter;
//# sourceMappingURL=ownerFirebaseAdapter.js.map