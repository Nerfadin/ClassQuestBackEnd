"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionMigrationAdapter = exports.INSTITUTIONS = void 0;
//cimport { CreateInstitutionDto } from '../../modules/institutions/CreateInstitutionDto';
const tsyringe_1 = require("../../utils/tsyringe");
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
exports.INSTITUTIONS = "institutions";
let InstitutionMigrationAdapter = class InstitutionMigrationAdapter {
    async getAllInstitutions() {
        const institutions = await (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection(exports.INSTITUTIONS).get());
        const institutionsIds = institutions.map((i) => {
            return i.id;
        });
        return institutionsIds;
    }
    async addInstitutionType(institutionType) {
        const institutionIds = await this.getAllInstitutions();
        institutionIds.map((institutionId) => {
            app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionId).set({
                institutionType: institutionType
            }, { merge: true });
        });
        app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionIds[0]).set({
            institutionType: "teacher"
        });
        return await app_1.adminDb.collection(exports.INSTITUTIONS).doc(institutionIds[0]).get();
    }
    addInstitutionOwner(institutionOwner, institution) {
        app_1.adminDb.collection(exports.INSTITUTIONS).doc(institution).set({
            owner: institutionOwner
        }, { merge: true });
    }
};
InstitutionMigrationAdapter = __decorate([
    (0, tsyringe_1.Singleton)()
], InstitutionMigrationAdapter);
exports.InstitutionMigrationAdapter = InstitutionMigrationAdapter;
//# sourceMappingURL=institutionMigrationAdapter.js.map