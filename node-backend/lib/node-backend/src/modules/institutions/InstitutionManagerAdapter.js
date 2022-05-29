"use strict";
/*import {
    CreateInstitutionDto,
    institutionHasTeacherDto,
    InstitutionRoles,
    UpdateInstitutionDto,
} from "./CreateInstitutionDto"; */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionManagerAdapter = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
//import { BadRequestError } from "../../utils/errorUtils";
const app_1 = require("../../app");
const InstitutionFirestoreAdaptor_1 = require("./InstitutionFirestoreAdaptor");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
let InstitutionManagerAdapter = class InstitutionManagerAdapter {
    constructor() { }
    async createInstitution(createDto) {
        const institution = await app_1.adminDb.collection(InstitutionFirestoreAdaptor_1.INSTITUTIONS).add(createDto);
        const institutiondocument = await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(InstitutionFirestoreAdaptor_1.INSTITUTIONS).doc(institution.id).get());
        return institutiondocument;
    }
    async createBatchedInstitutions(institutions) {
    }
    async updateInstitutionType(institutionId, institutionType) {
        await app_1.adminDb.collection(InstitutionFirestoreAdaptor_1.INSTITUTIONS).doc(institutionId).set({
            "institutionType": institutionType
        }, { merge: true });
        return await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(InstitutionFirestoreAdaptor_1.INSTITUTIONS).doc(institutionId).get());
    }
};
InstitutionManagerAdapter = __decorate([
    (0, tsyringe_1.Singleton)(),
    __metadata("design:paramtypes", [])
], InstitutionManagerAdapter);
exports.InstitutionManagerAdapter = InstitutionManagerAdapter;
//# sourceMappingURL=institutionManagerAdapter.js.map