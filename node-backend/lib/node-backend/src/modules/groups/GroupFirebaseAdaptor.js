"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupFirebaseAdaptor = exports.TEACHERS = exports.QUESTS_IN_GROUPS = exports.GROUPS = void 0;
const app_1 = require("../../app");
const generatePin_1 = require("../../utils/generatePin");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const questFirestoreToQuestDto_1 = require("../quests/converters/questFirestoreToQuestDto");
const tsyringe_1 = require("../../utils/tsyringe");
const firebase_admin_1 = require("firebase-admin");
const errorUtils_1 = require("../../utils/errorUtils");
exports.GROUPS = "groups";
exports.QUESTS_IN_GROUPS = "quests";
exports.TEACHERS = "teachers";
let GroupFirebaseAdaptor = class GroupFirebaseAdaptor {
    addPlayerToGroup(studentId, groupId) {
        return app_1.adminDb
            .collection(exports.GROUPS)
            .doc(groupId)
            .update({
            players: firebase_admin_1.firestore.FieldValue.arrayUnion(studentId),
            playersCount: firebase_admin_1.firestore.FieldValue.increment(1),
        });
    }
    updateGroup(questId, updateDto) {
        return app_1.adminDb.collection(exports.GROUPS).doc(questId).update(updateDto);
    }
    async getGroupsUnexpiredQuests(groupId) {
        const now = new Date();
        const unexpiredQuests = app_1.adminDb
            .collection(exports.QUESTS_IN_GROUPS)
            .where("groupId", "==", groupId)
            .where("dataExpiracao", ">", now);
        const questsWithoutExpirationDate = app_1.adminDb
            .collection(exports.QUESTS_IN_GROUPS)
            .where("groupId", "==", groupId)
            .where("dataExpiracao", "==", null);
        const [a, b] = await Promise.all([
            (0, firestoreUtils_1.manyDocumentsOrErrorP)(unexpiredQuests.get()),
            (0, firestoreUtils_1.manyDocumentsOrErrorP)(questsWithoutExpirationDate.get()),
        ]);
        return b.concat(a).map(questFirestoreToQuestDto_1.questInGroupFirestoreToQuestInGroupDto);
    }
    async createGroupWithId(body, teacherId) {
        const group = await app_1.adminDb.collection(exports.GROUPS).doc(body.id).set({
            avaregeScore: 0,
            description: "",
            id: body.id,
            players: [],
            playesCount: 0,
            questCount: 0,
            subjects: [body.subject],
            messages: [],
            teacherId: teacherId,
            subject: body.subject,
            studentsAnswred: 0
        });
        return group;
    }
    getGroup(id) {
        return (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.GROUPS).doc(id).get()).catch(async (err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError
                ? new errorUtils_1.EntityNotFoundError({
                    type: "group_not_found",
                    message: "Grupo não encontrado",
                    details: err,
                })
                : err;
        });
    }
    // gets a list of groups, ignores undefined groups
    async getGroups(ids) {
        const docRefs = ids.map((id) => app_1.adminDb.collection(exports.GROUPS).doc(id));
        const firestoreGroups = await Promise.all(docRefs.map((d) => (0, firestoreUtils_1.oneDocumentP)(d.get()).catch((_err) => undefined)));
        const existingGroups = firestoreGroups.filter((group) => !!group);
        return existingGroups;
    }
    createTeacherProfileGroup(id, name) {
        return app_1.adminDb
            .collection(exports.GROUPS)
            .doc(id)
            .set({
            id,
            pin: (0, generatePin_1.generatePin)(),
            teacher: app_1.adminDb.collection(exports.TEACHERS).doc(id),
            name,
            description: "",
            subject: ["Perfil"],
            questsCount: 0,
        });
    }
};
GroupFirebaseAdaptor = __decorate([
    (0, tsyringe_1.Singleton)()
], GroupFirebaseAdaptor);
exports.GroupFirebaseAdaptor = GroupFirebaseAdaptor;
//# sourceMappingURL=GroupFirebaseAdaptor.js.map