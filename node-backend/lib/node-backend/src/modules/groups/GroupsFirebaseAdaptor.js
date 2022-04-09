"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsFirebaseAdaptor = exports.TEACHERS = exports.QUESTS_IN_GROUPS = exports.GROUPS = void 0;
const maybe_1 = require("../../utils/maybe");
const app_1 = require("../../app");
const generatePin_1 = require("../../utils/generatePin");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
exports.GROUPS = "groups";
exports.QUESTS_IN_GROUPS = "quests";
exports.TEACHERS = "teachers";
class GroupsFirebaseAdaptor {
    findGroupsQuests(groupId) {
        const questsRef = app_1.adminDb
            .collection(exports.QUESTS_IN_GROUPS)
            .where("groupId", "==", groupId);
        return maybe_1.tryCatch((async () => firestoreUtils_1.manyDocuments(await questsRef.get()))());
    }
    findGroup(groupId) {
        return firestoreUtils_1.oneDocumentOrError(app_1.adminDb.collection(exports.GROUPS).doc(groupId).get());
    }
    createTeacherProfileGroup(id, name) {
        return maybe_1.tryCatch(app_1.adminDb
            .collection(exports.GROUPS)
            .doc(id)
            .set({
            id: id,
            pin: generatePin_1.generatePin(),
            teacher: app_1.adminDb.collection(exports.TEACHERS).doc(id),
            name: name,
            description: "",
            subject: ["Perfil"],
            questsCount: 0,
        }));
    }
}
exports.GroupsFirebaseAdaptor = GroupsFirebaseAdaptor;
//# sourceMappingURL=GroupsFirebaseAdaptor.js.map