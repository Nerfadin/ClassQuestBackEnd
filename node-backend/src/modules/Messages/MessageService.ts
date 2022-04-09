
import { Inject, Singleton } from "../../utils/tsyringe";
import { MessageFireBaseAdapter } from './MessageFirebaseAdapter';
import { MessageErrors } from './MessageErrors';
import { EntityNotFoundError } from "../../utils/errorUtils";
import { SendMessageToGroupDto } from "./MessageDto";


@Singleton()
export class MessageService {
    constructor(
        @Inject(() => MessageFireBaseAdapter) private messagesDao: MessageFireBaseAdapter,
    ) { }
    async getMessageIdsFromGroup(groupId: string) {
        return this.messagesDao.getMessagesIdsFromGroup(groupId);
    }
    async getMessagesByIds(messageIds: string[]) {
        return await this.messagesDao.GetMessages(messageIds).catch((err) => {
            throw err instanceof EntityNotFoundError ?
                MessageErrors.MessageNotFound(err) : err
        });
    }        
    async removeMessageFromGroup(groupId: string, messageId: string){
              
       await this.messagesDao.deleteMessageFromGroup(messageId).then (()=> {
        this.messagesDao.RemoveMessageIdFromGroup(groupId, messageId);
       });
    }
    async SendMessageToGroup(groupId: string, message: SendMessageToGroupDto, teacherId: string){
        return await this.messagesDao.sendMessageToGroup(message, groupId, teacherId);    
    }
    async getMessageFromGroup(groupPin: string){
        const messageIds = await this.messagesDao.getMessagesIdsFromGroup(groupPin);
        return this.getMessagesByIds(messageIds!).catch((err) =>
            {                
                return [];
            }
        );
    }
    



}

