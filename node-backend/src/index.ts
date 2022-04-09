import "reflect-metadata";
import * as functions from "firebase-functions";
import algoliasearch from "algoliasearch";
import dayjs from "dayjs";
// import sgMail from "@sendgrid/mail";
import { reportFailureFunctions } from "./express/express-helpers";
import { adminDb } from "./app";
import admin from "firebase-admin";
import main from "./express";
import devFunc from "./express/index-dev";
import { Quest } from "../../packages/interfaces/quest";
import { QuestInGroupDto, Group } from "../../packages/interfaces/groups";
import { ShopService } from "./modules/shop/ShopService";
import { build } from "./utils/tsyringe";
import { EmailService } from "./modules/email/EmailService";
// sgMail.setApiKey(
//   "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"
// );

const env = functions.config();
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const questsSearch = client.initIndex("teacher_quests_search");

export const api = functions.https.onRequest(main);
export const dev = functions.https.onRequest(devFunc);

export const updateShop = functions.pubsub
  .schedule("0 */3 * * *")
  .onRun((ctx) => {
    const refreshIn = dayjs(ctx.timestamp).add(3, "hour").toDate();
    const shopService = build(ShopService);
    return reportFailureFunctions(shopService.refreshShop(refreshIn));
  });

// roda todo dia às meia noite
export const endFreeTrials = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async (ctx) => {
    const start = dayjs().toDate();
    const end = dayjs().subtract(25, "hour").toDate(); // get all tasks from the last 24 hrs
    const tasks = await adminDb
      .collection("scheduled_tasks")
      .where("dueDate", ">", start)
      .where("dueDate", "<", end)
      .get();
    const promises = tasks.docs.map(async (doc) => {
      const task = {
        // ScheduledTask
        ...doc.data(),
        id: doc.id,
      } as any;
      if (task.type === "remove_teachers_paid_plan") {
        const security = adminDb
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
        const security = adminDb
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

export const createIndexSecurityQuest = functions.firestore
  .document("security/{questId}")
  .onCreate((snap, ctx) => {
    const data = snap.data() as any;
    const objectID = snap.id;
    return questsSearch.partialUpdateObject({
      isPublic: data.isPublic,
      objectID,
    });
  });
export const updateIndexSecurityQuest = functions.firestore
  .document("security/{questId}")
  .onUpdate((snap, ctx) => {
    const data = snap.after.data() as any;
    const objectID = snap.after.id;
    return questsSearch.partialUpdateObject({
      isPublic: data.isPublic,
      objectID,
    });
  });

export const indexQuest = functions.firestore
  .document("quest_models/{questId}")
  .onCreate((snap, ctx) => {
    const data = snap.data() as Quest;
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
    return questsSearch.saveObject({
      ...quest,
      objectID,
      // _tags:[
      //   data.teacher.id
      // ]
    });
  });
export const updateIndexQuest = functions.firestore
  .document("quest_models/{questId}")
  .onUpdate(async (snap, ctx) => {
    const data = snap.after.data() as Quest;
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
    const clones = await adminDb
      .collection("quests")
      .where("originalQuestId", "==", objectID)
      .get();
    const promises = clones.docs.map((clone) => {
      return adminDb
        .collection("quests")
        .doc(clone.ref.id)
        .update({
          ...data,
          id: clone.ref.id,
        });
    });
    await Promise.all(promises);
    return questsSearch.partialUpdateObject({
      ...quest,
      objectID,
    });
  });
export const uninedxQuest = functions.firestore
  .document("quest_models/{questId}")
  .onDelete(async (snap, ctx) => {
    const objectID = snap.id;
    await adminDb.collection("security").doc(objectID).delete();
    const clones = await adminDb
      .collection("quests")
      .where("originalQuestId", "==", objectID)
      .get();
    await Promise.all(
      clones.docs.map((clone) => {
        return clone.ref.delete();
      })
    );
    return await questsSearch.deleteObject(objectID);
  });

//when deleting a folder, delete its quets too
export const deleteQuestsOnDeleteFolder = functions.firestore
  .document("folders/{folderId}")
  .onDelete(async (change, context) => {
    console.log("delete all subfolders and subquests");
    const children = await getChildren(change.id);
    console.log("children", children);
    const deletePromises = <Promise<any>[]>[];
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
export const updateGroupQuestCountOnCreate = functions.firestore
  .document("quests/{questId}")
  .onCreate(async (change, context) => {
    const quest = change.data(); // as QuestInGroup;
    await adminDb
      .collection("quest_models")
      .doc(quest.originalQuestId)
      .update({
        groupsCount: admin.firestore.FieldValue.increment(1),
      });
    await adminDb
      .collection("groups")
      .doc(quest.groupId)
      .update({
        questsCount: admin.firestore.FieldValue.increment(1),
      });
  });

export const addTeacherMateria = functions.firestore
  .document("quest_models/{questId}")
  .onWrite(async (change, context) => {
    if (change.after.exists) {
      const questAfter = change.after.data() as QuestInGroupDto; // TODO: Quest
      await adminDb
        .collection("teachers")
        .doc(questAfter.teacherId)
        .update({
          [`materias.${questAfter.institutionId}`]: admin.firestore.FieldValue.arrayUnion(
            questAfter.materia
          ),
        });
    }
  });

export const updateGroupQuestCountOnDelete = functions.firestore
  .document("quests/{questId}")
  .onDelete(async (change, context) => {
    const quest = change.data(); // as QuestInGroup;
    try {
      await adminDb
        .collection("quest_models")
        .doc(quest.originalQuestId)
        .update({
          groupsCount: admin.firestore.FieldValue.increment (-1),
        });
    } catch (e) {}
    try {
      await adminDb
        .collection("groups")
        .doc(quest.groupId)
        .update({
          questsCount: admin.firestore.FieldValue.increment(-1),
        });
    } catch (e) {}
  });

export const deleteGroupQuestsOnGroupDelete = functions.firestore
  .document("groups/{groupId}")
  .onDelete(async (change, context) => {
    const group = change.data() as Group;
    const players = await adminDb.getAll(
      ...group.players.map(adminDb.collection("players").doc)
    );
    await players.map((p) =>
      p.ref.update({
        groupIds: admin.firestore.FieldValue.arrayRemove(change.id),
      })
    );
    const quests = await adminDb
      .collection("quests")
      .where("groupId", "==", change.ref.id)
      .get();
    return await Promise.all(
      quests.docs.map((quest) => {
        return adminDb.collection("quests").doc(quest.id).delete();
      })
    );
  });
async function getChildren(folderId: string) {
  const children = <admin.firestore.DocumentReference[]>[];
  const folderRef = adminDb.collection("folders").doc(folderId);
  const questsChildren = adminDb
    .collection("quest_models")
    .where("folderId", "==", folderRef.id);
  const foldersChildren = adminDb
    .collection("folders")
    .where("parent", "==", folderRef);
  const [quests, folders] = await Promise.all([
    questsChildren.get(),
    foldersChildren.get(),
  ]);
  quests.docs.forEach((q) => {
    children.push(adminDb.collection("quest_models").doc(q.id));
  });
  folders.docs.forEach((f) => {
    children.push(adminDb.collection("folders").doc(f.id));
  });
  if (folders.docs.length) {
    const subfoldersChildren = <Promise<any>[]>[];
    folders.docs.forEach((f) => {
      subfoldersChildren.push(
        getChildren(f.id).then((c) => children.concat(c))
      );
    });
    await Promise.all(subfoldersChildren);
  }
  return children;
}

export const registerEmail = functions.firestore
  .document("teachers/{teacherId}")
  .onCreate(async (snap, ctx) => {
    const emailService = build(EmailService);
    const res = emailService.sendTeachersRegisterEmail(snap.data());
    return reportFailureFunctions(res);
  });

export const sendEmail = functions.firestore
  .document("form/{submissionId}")
  .onCreate(async (snap, ctx) => {
    const data = snap.data() as any;
    const emailService = build(EmailService);
    const res = emailService.sendWebsiteContactformEmail(data);
    return reportFailureFunctions(res);
  });
