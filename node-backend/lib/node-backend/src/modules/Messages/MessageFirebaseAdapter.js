"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFireBaseAdapter = exports.MESSAGES = exports.GROUPS = void 0;
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const tsyringe_1 = require("tsyringe");
const app_1 = require("../../app");
const firebase_admin_1 = require("firebase-admin");
const errorUtils_1 = require("../../utils/errorUtils");
exports.GROUPS = "groups";
exports.MESSAGES = "messages";
//pin teste *q*KNW
let MessageFireBaseAdapter = class MessageFireBaseAdapter {
    // TODO: Alterar essa chamada para usar o message Service
    async getMessagesIdsFromGroup(pin) {
        try {
            return await (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb
                .collection(exports.GROUPS)
                .doc(pin)
                .get()).then((group) => group.messages);
        }
        catch (_err) {
            console.log(_err);
            return [''];
        }
        return [];
    }
    async deleteMessageFromGroup(messageId) {
        await app_1.adminDb.collection(exports.MESSAGES).doc(messageId).delete().then(() => {
            console.log("after finally delete");
        });
    }
    async openMessage(messageId, playerId) {
        app_1.adminDb.collection(exports.MESSAGES).doc(messageId).update({
            visualizedBy: firebase_admin_1.firestore.FieldValue.arrayUnion(playerId)
        });
    }
    async sendMessageToGroup(message, groupId, teacherId) {
        const messageResult = await app_1.adminDb.collection(exports.MESSAGES).add({
            title: message.title,
            message: message.message,
            CreatedAt: Date.now(),
            visualizedBy: [],
            teacherId: teacherId
        });
        await this.SetMessageInGroupArray(messageResult.id, groupId);
        return messageResult;
    }
    async RemoveMessageIdFromGroup(groupId, messageId) {
        console.log("inside removeMessageId");
        await app_1.adminDb.collection(exports.GROUPS).doc(groupId).set({
            messages: firebase_admin_1.firestore.FieldValue.arrayRemove(messageId)
        }, { merge: true }).catch((err) => {
            throw err instanceof errorUtils_1.BadRequestError
                ? new errorUtils_1.BadRequestError({
                    type: "bad_request",
                    message: "Não foi possível fazer a atualização do grupo.",
                    details: err,
                })
                : console.log(err);
        }).finally(() => {
            console.log("inside finally");
        });
    }
    async SetMessageInGroupArray(messageId, groupId) {
        return app_1.adminDb.collection(exports.GROUPS)
            .doc(groupId)
            .set({
            messages: firebase_admin_1.firestore.FieldValue.arrayUnion(messageId)
        }, { merge: true });
    }
    //retorna mensagens de uma lista de ids que são os Ids mensagens, os ids são pegos do getGroupMessagesIds
    async GetMessages(ids) {
        const docRefs = ids.map((id) => app_1.adminDb
            .collection(exports.MESSAGES)
            .doc(id));
        const firestoreMessages = await Promise.all(docRefs.map((d) => (0, firestoreUtils_1.oneDocumentP)(d.get())));
        const messagesAvailable = firestoreMessages.filter((message) => !!message);
        return messagesAvailable;
    }
};
MessageFireBaseAdapter = __decorate([
    (0, tsyringe_1.singleton)()
], MessageFireBaseAdapter);
exports.MessageFireBaseAdapter = MessageFireBaseAdapter;
//# sourceMappingURL=MessageFirebaseAdapter.js.map