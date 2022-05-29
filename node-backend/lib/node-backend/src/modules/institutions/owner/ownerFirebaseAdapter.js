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
const firestoreUtils_1 = require("../../../utils/firestoreUtils");
exports.OWNER = "owner";
exports.OWNEDINSTITUTIONS = "ownedInstitution";
const InstitutionManagerAdapter_1 = require("../InstitutionManagerAdapter");
let OwnerFirebaseAdapter = class OwnerFirebaseAdapter {
    async getOwnerInstitutions(ownerId) {
        const ownedInstitutions = await app_1.adminDb.collection(exports.OWNER).doc(ownerId).collection(exports.OWNEDINSTITUTIONS);
        return (0, firestoreUtils_1.manyDocumentsOrErrorP)(ownedInstitutions.get());
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
    async CreateSchool(schools) {
        const ownerId = 'QHISBM5KryaXQHmPNc2I';
        let createdSchools = [];
        schools['data'].map(async (schoolDto) => {
            const school = await app_1.adminDb.collection(InstitutionManagerAdapter_1.SCHOOLS).add({
                "institutionType": "school",
                "institutionName": schoolDto.name,
                "institutionOwnerId": ownerId,
                "institutionCity": schoolDto.city,
                'ownerId': ownerId
            });
            await app_1.adminDb.collection(InstitutionManagerAdapter_1.SCHOOLS).doc(school.id).set({
                "id": school.id
            }, { merge: true });
            const schoolCreated = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(InstitutionManagerAdapter_1.SCHOOLS).doc(school.id).get());
            createdSchools.push(schoolCreated);
        });
        console.log(createdSchools.length);
        return createdSchools;
    }
};
OwnerFirebaseAdapter = __decorate([
    (0, tsyringe_1.Singleton)()
], OwnerFirebaseAdapter);
exports.OwnerFirebaseAdapter = OwnerFirebaseAdapter;
//# sourceMappingURL=ownerFirebaseAdapter.js.map