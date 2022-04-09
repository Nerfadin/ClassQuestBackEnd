"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerFirebaseAdapter = exports.SECURITY = exports.QUESTIONLIST = exports.TOWER = exports.TOWERQUESTS = void 0;
const app_1 = require("../../../app");
const firebase_admin_1 = require("firebase-admin");
const tsyringe_1 = require("../../../utils/tsyringe");
const firestoreUtils_1 = require("../../../utils/firestoreUtils");
exports.TOWERQUESTS = "towerQuestions";
exports.TOWER = "endlessTower";
exports.QUESTIONLIST = "towerQuestionList";
exports.SECURITY = "security";
let TowerFirebaseAdapter = class TowerFirebaseAdapter {
    getTower(towerPin) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(exports.TOWER).doc(towerPin).get());
    }
    createTower(body) {
        const tower = app_1.adminDb
            .collection(exports.TOWER)
            .doc(body.towerPin)
            .set({
            towerPin: body.towerPin,
            towerName: body.name,
            institutionId: body.institutionId,
            players: [],
            createdAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()),
        });
        return tower;
    }
    async createTowerQuestionList(subject, towerId, institutionId, questions, teachersIds) {
        const questionListQuerry = await app_1.adminDb
            .collection(exports.TOWERQUESTS)
            .where("towerId", "==", towerId)
            .where("subject", "==", subject)
            .get()
            .then(function (querrySnaptot) {
            querrySnaptot.empty ?
                app_1.adminDb.collection(exports.TOWERQUESTS).add({
                    questions: questions,
                    subject: subject,
                    teachers: teachersIds,
                    createdAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()),
                    towerId: towerId,
                }) : app_1.adminDb.collection(exports.TOWERQUESTS)
                .doc(querrySnaptot[0].id)
                .set({
                questions: questions,
                subject: subject,
                teachers: teachersIds,
                createdAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()),
                towerId: towerId
            });
        });
        return questionListQuerry;
    }
    static async create(quest, teacher) {
        const questDoc = await app_1.adminDb.collection(exports.TOWERQUESTS).add(Object.assign(Object.assign({}, quest), { createdAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()) }));
        /*    await InstitutionSerivce.saveTeacherPlan(
              quest.teacherId,
              quest.institutionId,
              {
            //    quests: firebase.firestore.FieldValue.increment(1),
              }
            );*/
        return questDoc;
    }
    async createTowerQuest(body) {
        const quest = await app_1.adminDb.collection(exports.TOWERQUESTS).add(Object.assign(Object.assign({}, body), { towerId: body.towerId })).then((firebaseDoc) => {
            firebaseDoc.set({
                questId: firebaseDoc.id
            }, { merge: true });
        });
        return quest;
    }
    async addQuestToTower(questToAdd) {
        const towerQuest = app_1.adminDb.collection(exports.TOWERQUESTS).doc(questToAdd.id).set(Object.assign(Object.assign({}, questToAdd), { createdAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()) }));
        return towerQuest;
    }
};
TowerFirebaseAdapter = __decorate([
    tsyringe_1.Singleton()
], TowerFirebaseAdapter);
exports.TowerFirebaseAdapter = TowerFirebaseAdapter;
//# sourceMappingURL=EndlessTowerFirebaseAdapter.js.map