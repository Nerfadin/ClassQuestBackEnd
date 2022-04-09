"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestMigrator = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const InstitutionFirestoreAdaptor_1 = require("../../modules/institutions/InstitutionFirestoreAdaptor");
/**  TODO
 *  criar relação entre quest e institution
*/
//quest Id for testing: DOgB9Z
let QuestMigrator = class QuestMigrator {
    async getAllQuests() {
        const quests = await firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb.collection("quests").get());
        console.log(quests.length);
        return quests;
    }
    async getAllQuestsFromTeacher(teacherId) {
        const questsFromTeacher = await firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb.collection("quests").where("teacherId", "==", teacherId).get());
        console.log(questsFromTeacher.length);
        return questsFromTeacher;
    }
    async getTeacher(teacherId) {
        firestoreUtils_1.oneDocumentP(app_1.adminDb.collection("teachers").doc(teacherId).get());
    }
    async migrateAllQuests() {
        const allquests = await this.getAllQuests();
        console.log(allquests.length);
        allquests.map(async (quest) => {
            if (quest.id != null || quest.id != undefined) {
                await this.getOneQuestAndAddTeacherField(quest.id);
                console.log("quest updated" + quest.id);
            }
            else {
                console.log(quest);
            }
        });
    }
    async createQuestRelationshipWithInstitution() {
        const quests = await this.getAllQuests();
        quests.map(async (quest) => {
            app_1.adminDb.collection(InstitutionFirestoreAdaptor_1.INSTITUTION_HAS_QUESTS).add({
                institutionIds: quest.institutionId,
                questId: quest.id
            });
        });
        //    const quests = await this.getAllQuests()
    }
    async insertTeacherInDocument(questId, teacherName) {
        app_1.adminDb.collection("quests").doc(questId).set({
            teacherName: teacherName,
        }, { merge: true });
    }
    async getOneQuestAndAddTeacherField(questId) {
        const quest = await firestoreUtils_1.oneDocumentP(app_1.adminDb.collection("quests").doc(questId).get());
        console.log(quest.title);
        const teacher = await firestoreUtils_1.oneDocumentP(app_1.adminDb.collection("teachers").doc(quest.teacherId).get());
        await app_1.adminDb.collection("quests").doc(questId).set({
            teacherName: teacher.nome,
        }, { merge: true });
        return await firestoreUtils_1.oneDocumentP(app_1.adminDb.collection("quests").doc(questId).get());
    }
};
QuestMigrator = __decorate([
    tsyringe_1.Singleton()
], QuestMigrator);
exports.QuestMigrator = QuestMigrator;
//# sourceMappingURL=questMigrationAdapter.js.map