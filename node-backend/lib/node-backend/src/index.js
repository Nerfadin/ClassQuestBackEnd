"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.registerEmail = exports.deleteGroupQuestsOnGroupDelete = exports.updateGroupQuestCountOnDelete = exports.addTeacherMateria = exports.updateGroupQuestCountOnCreate = exports.deleteQuestsOnDeleteFolder = exports.uninedxQuest = exports.updateIndexQuest = exports.indexQuest = exports.updateIndexSecurityQuest = exports.createIndexSecurityQuest = exports.endFreeTrials = exports.updateShop = exports.dev = exports.api = void 0;
require("reflect-metadata");
const functions = __importStar(require("firebase-functions"));
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const dayjs_1 = __importDefault(require("dayjs"));
// import sgMail from "@sendgrid/mail";
const express_helpers_1 = require("./express/express-helpers");
const app_1 = require("./app");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const express_1 = __importDefault(require("./express"));
const index_dev_1 = __importDefault(require("./express/index-dev"));
const ShopService_1 = require("./modules/shop/ShopService");
const tsyringe_1 = require("./utils/tsyringe");
const EmailService_1 = require("./modules/email/EmailService");
// sgMail.setApiKey(
//   "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"
// );
const env = functions.config();
const client = algoliasearch_1.default(env.algolia.appid, env.algolia.apikey);
const questsSearch = client.initIndex("teacher_quests_search");
exports.api = functions.https.onRequest(express_1.default);
exports.dev = functions.https.onRequest(index_dev_1.default);
exports.updateShop = functions.pubsub
    .schedule("0 */3 * * *")
    .onRun((ctx) => {
    const refreshIn = dayjs_1.default(ctx.timestamp).add(3, "hour").toDate();
    const shopService = tsyringe_1.build(ShopService_1.ShopService);
    return express_helpers_1.reportFailureFunctions(shopService.refreshShop(refreshIn));
});
// roda todo dia às meia noite
exports.endFreeTrials = functions.pubsub
    .schedule("0 0 * * *")
    .onRun(async (ctx) => {
    const start = dayjs_1.default().toDate();
    const end = dayjs_1.default().subtract(25, "hour").toDate(); // get all tasks from the last 24 hrs
    const tasks = await app_1.adminDb
        .collection("scheduled_tasks")
        .where("dueDate", ">", start)
        .where("dueDate", "<", end)
        .get();
    const promises = tasks.docs.map(async (doc) => {
        const task = Object.assign(Object.assign({}, doc.data()), { id: doc.id });
        if (task.type === "remove_teachers_paid_plan") {
            const security = app_1.adminDb
                .collection("teacher_security")
                .doc(task.teacherId);
            return security
                .update({
                plan: "free",
            })
                .then((e) => {
                return doc.ref.delete(); //remove task
            });
        }
        if (task.type === "remove_institutions_paid_plan") {
            const security = app_1.adminDb
                .collection("institution_security")
                .doc(task.institutionId);
            return security
                .update({
                plan: "free",
            })
                .then((e) => {
                return doc.ref.delete(); //remove task
            });
        }
        return undefined;
    });
    return await Promise.all(promises);
});
exports.createIndexSecurityQuest = functions.firestore
    .document("security/{questId}")
    .onCreate((snap, ctx) => {
    const data = snap.data();
    const objectID = snap.id;
    return questsSearch.partialUpdateObject({
        isPublic: data.isPublic,
        objectID,
    });
});
exports.updateIndexSecurityQuest = functions.firestore
    .document("security/{questId}")
    .onUpdate((snap, ctx) => {
    const data = snap.after.data();
    const objectID = snap.after.id;
    return questsSearch.partialUpdateObject({
        isPublic: data.isPublic,
        objectID,
    });
});
exports.indexQuest = functions.firestore
    .document("quest_models/{questId}")
    .onCreate((snap, ctx) => {
    const data = snap.data();
    const objectID = snap.id;
    const quest = {
        id: objectID,
        materia: data.materia,
        questions: data.questions,
        title: data.title,
        dificuldade: data.dificuldade,
        description: data.description,
        createdAt: data.createdAt.toDate(),
        bncc: data.bncc,
        folderId: data.folderId,
        teacherId: data.teacherId,
    };
    return questsSearch.saveObject(Object.assign(Object.assign({}, quest), { objectID }));
});
exports.updateIndexQuest = functions.firestore
    .document("quest_models/{questId}")
    .onUpdate(async (snap, ctx) => {
    const data = snap.after.data();
    const objectID = snap.after.id;
    const quest = {
        id: objectID,
        questions: data.questions,
        title: data.title,
        dificuldade: data.dificuldade,
        description: data.description,
        materia: data.materia,
        createdAt: data.createdAt.toDate(),
        bncc: data.bncc,
        folderId: data.folderId,
        teacherId: data.teacherId,
    };
    const clones = await app_1.adminDb
        .collection("quests")
        .where("originalQuestId", "==", objectID)
        .get();
    const promises = clones.docs.map((clone) => {
        return app_1.adminDb
            .collection("quests")
            .doc(clone.ref.id)
            .update(Object.assign(Object.assign({}, data), { id: clone.ref.id }));
    });
    await Promise.all(promises);
    return questsSearch.partialUpdateObject(Object.assign(Object.assign({}, quest), { objectID }));
});
exports.uninedxQuest = functions.firestore
    .document("quest_models/{questId}")
    .onDelete(async (snap, ctx) => {
    const objectID = snap.id;
    await app_1.adminDb.collection("security").doc(objectID).delete();
    const clones = await app_1.adminDb
        .collection("quests")
        .where("originalQuestId", "==", objectID)
        .get();
    await Promise.all(clones.docs.map((clone) => {
        return clone.ref.delete();
    }));
    return await questsSearch.deleteObject(objectID);
});
//when deleting a folder, delete its quets too
exports.deleteQuestsOnDeleteFolder = functions.firestore
    .document("folders/{folderId}")
    .onDelete(async (change, context) => {
    console.log("delete all subfolders and subquests");
    const children = await getChildren(change.id);
    console.log("children", children);
    const deletePromises = [];
    children.forEach((c) => deletePromises.push(c.delete()));
    return await Promise.all(deletePromises);
});
// //when adding a new answer, update its quest
// export const updateQuestStatistics = functions.firestore
//   .document("players/{playerId}/answers/{groupId_questId}")
//   .onCreate(async (change, context) => {
//     const answer = change.data() as Answer;
//     const quest = (
//       await adminDb.collection("quests").doc(answer.questId).get()
//     ).data()!;
//     const studentsAnswerd = quest.studentsAnswered ?? 0;
//     const oldAvgScore = quest.averageScore ?? 0;
//     const newAvgScore =
//       (studentsAnswerd * oldAvgScore + answer.score) / studentsAnswerd + 1;
//     await adminDb
//       .collection("quests")
//       .doc(answer.questId)
//       .update({
//         averageScore: newAvgScore,
//         studentsAnswerd: studentsAnswerd + 1,
//       });
//   });
exports.updateGroupQuestCountOnCreate = functions.firestore
    .document("quests/{questId}")
    .onCreate(async (change, context) => {
    const quest = change.data(); // as QuestInGroup;
    await app_1.adminDb
        .collection("quest_models")
        .doc(quest.originalQuestId)
        .update({
        groupsCount: firebase_admin_1.default.firestore.FieldValue.increment(1),
    });
    await app_1.adminDb
        .collection("groups")
        .doc(quest.groupId)
        .update({
        questsCount: firebase_admin_1.default.firestore.FieldValue.increment(1),
    });
});
exports.addTeacherMateria = functions.firestore
    .document("quest_models/{questId}")
    .onWrite(async (change, context) => {
    if (change.after.exists) {
        const questAfter = change.after.data(); // TODO: Quest
        await app_1.adminDb
            .collection("teachers")
            .doc(questAfter.teacherId)
            .update({
            [`materias.${questAfter.institutionId}`]: firebase_admin_1.default.firestore.FieldValue.arrayUnion(questAfter.materia),
        });
    }
});
exports.updateGroupQuestCountOnDelete = functions.firestore
    .document("quests/{questId}")
    .onDelete(async (change, context) => {
    const quest = change.data(); // as QuestInGroup;
    try {
        await app_1.adminDb
            .collection("quest_models")
            .doc(quest.originalQuestId)
            .update({
            groupsCount: firebase_admin_1.default.firestore.FieldValue.increment(-1),
        });
    }
    catch (e) { }
    try {
        await app_1.adminDb
            .collection("groups")
            .doc(quest.groupId)
            .update({
            questsCount: firebase_admin_1.default.firestore.FieldValue.increment(-1),
        });
    }
    catch (e) { }
});
exports.deleteGroupQuestsOnGroupDelete = functions.firestore
    .document("groups/{groupId}")
    .onDelete(async (change, context) => {
    const group = change.data();
    const players = await app_1.adminDb.getAll(...group.players.map(app_1.adminDb.collection("players").doc));
    await players.map((p) => p.ref.update({
        groupIds: firebase_admin_1.default.firestore.FieldValue.arrayRemove(change.id),
    }));
    const quests = await app_1.adminDb
        .collection("quests")
        .where("groupId", "==", change.ref.id)
        .get();
    return await Promise.all(quests.docs.map((quest) => {
        return app_1.adminDb.collection("quests").doc(quest.id).delete();
    }));
});
async function getChildren(folderId) {
    const children = [];
    const folderRef = app_1.adminDb.collection("folders").doc(folderId);
    const questsChildren = app_1.adminDb
        .collection("quest_models")
        .where("folderId", "==", folderRef.id);
    const foldersChildren = app_1.adminDb
        .collection("folders")
        .where("parent", "==", folderRef);
    const [quests, folders] = await Promise.all([
        questsChildren.get(),
        foldersChildren.get(),
    ]);
    quests.docs.forEach((q) => {
        children.push(app_1.adminDb.collection("quest_models").doc(q.id));
    });
    folders.docs.forEach((f) => {
        children.push(app_1.adminDb.collection("folders").doc(f.id));
    });
    if (folders.docs.length) {
        const subfoldersChildren = [];
        folders.docs.forEach((f) => {
            subfoldersChildren.push(getChildren(f.id).then((c) => children.concat(c)));
        });
        await Promise.all(subfoldersChildren);
    }
    return children;
}
exports.registerEmail = functions.firestore
    .document("teachers/{teacherId}")
    .onCreate(async (snap, ctx) => {
    const emailService = tsyringe_1.build(EmailService_1.EmailService);
    const res = emailService.sendTeachersRegisterEmail(snap.data());
    return express_helpers_1.reportFailureFunctions(res);
});
exports.sendEmail = functions.firestore
    .document("form/{submissionId}")
    .onCreate(async (snap, ctx) => {
    const data = snap.data();
    const emailService = tsyringe_1.build(EmailService_1.EmailService);
    const res = emailService.sendWebsiteContactformEmail(data);
    return express_helpers_1.reportFailureFunctions(res);
});
//# sourceMappingURL=index.js.map