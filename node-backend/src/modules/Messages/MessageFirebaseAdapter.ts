import { Group } from "@interfaces/groups";
import { oneDocumentP } from "../../utils/firestoreUtils";
import { singleton } from "tsyringe";
import { adminDb } from "../../app";
import { GetMessageDto, SendMessageToGroupDto } from "./MessageDto";
import { firestore } from "firebase-admin";
import { BadRequestError } from "../../utils/errorUtils";
export const GROUPS = "groups";
export const MESSAGES = "messages"
//pin teste *q*KNW
@singleton()
export class MessageFireBaseAdapter {
  // TODO: Alterar essa chamada para usar o message Service
  async getMessagesIdsFromGroup(pin: string) {
    try{
    return await oneDocumentP<Group>(adminDb
      .collection(GROUPS)
      .doc(pin)
      .get()).then((group) => group.messages);
    }catch (_err){
      console.log(_err);
      return ['']
    }
    return []
    }
  async deleteMessageFromGroup(messageId: string) {
    await adminDb.collection(MESSAGES).doc(messageId).delete().then(()=> {
      console.log("after finally delete")
    });
  }
  async openMessage(messageId: string, playerId: string){
    adminDb.collection(MESSAGES).doc(messageId).update({
    visualizedBy: firestore.FieldValue.arrayUnion(playerId)
    })
  }
  async sendMessageToGroup(message: SendMessageToGroupDto, groupId: string, teacherId: string) {
    const messageResult = await adminDb.collection(MESSAGES).add({
      title: message.title,
      message: message.message,
      CreatedAt: Date.now(),
      visualizedBy: [],
      teacherId: teacherId
    });
    await this.SetMessageInGroupArray(messageResult.id, groupId);
    return messageResult;
  }
  async RemoveMessageIdFromGroup(groupId: string, messageId) {
    console.log("inside removeMessageId");
    await adminDb.collection(GROUPS).doc(groupId).set({
      messages: firestore.FieldValue.arrayRemove(messageId)
    }, {merge:true}).catch ((err) => {
      throw err instanceof BadRequestError
        ? new BadRequestError({
          type: "bad_request",
          message: "Não foi possível fazer a atualização do grupo.",
          details: err,
        })
        : console.log(err);
    }).finally (()=> {
      console.log("inside finally");
    });    

  }
  async SetMessageInGroupArray(messageId: string, groupId: string) {
    return adminDb.collection(GROUPS)
      .doc(groupId)
      .set({
        messages: firestore.FieldValue.arrayUnion(messageId)
      }, { merge: true })
  }
  //retorna mensagens de uma lista de ids que são os Ids mensagens, os ids são pegos do getGroupMessagesIds
  async GetMessages(ids: string[]) {
    const docRefs = ids.map((id) => adminDb
      .collection(MESSAGES)
      .doc(id));
    const firestoreMessages = await Promise.all(
      docRefs.map((d) =>
        oneDocumentP<GetMessageDto>(d.get()))
    )
    const messagesAvailable = firestoreMessages.filter(
      (message) => !!message
    ) as GetMessageDto[];
    return messagesAvailable;
  }
}
