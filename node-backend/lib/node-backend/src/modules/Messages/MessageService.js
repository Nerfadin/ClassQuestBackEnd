"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const tsyringe_1 = require("../../utils/tsyringe");
const MessageFirebaseAdapter_1 = require("./MessageFirebaseAdapter");
const MessageErrors_1 = require("./MessageErrors");
const errorUtils_1 = require("../../utils/errorUtils");
let MessageService = class MessageService {
    constructor(messagesDao) {
        this.messagesDao = messagesDao;
    }
    async getMessageIdsFromGroup(groupId) {
        return this.messagesDao.getMessagesIdsFromGroup(groupId);
    }
    async getMessagesByIds(messageIds) {
        return await this.messagesDao.GetMessages(messageIds).catch((err) => {
            throw err instanceof errorUtils_1.EntityNotFoundError ?
                MessageErrors_1.MessageErrors.MessageNotFound(err) : err;
        });
    }
    async removeMessageFromGroup(groupId, messageId) {
        await this.messagesDao.deleteMessageFromGroup(messageId).then(() => {
            this.messagesDao.RemoveMessageIdFromGroup(groupId, messageId);
        });
    }
    async SendMessageToGroup(groupId, message, teacherId) {
        return await this.messagesDao.sendMessageToGroup(message, groupId, teacherId);
    }
    async getMessageFromGroup(groupPin) {
        const messageIds = await this.messagesDao.getMessagesIdsFromGroup(groupPin);
        return this.getMessagesByIds(messageIds).catch((err) => {
            return [];
        });
    }
};
MessageService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => MessageFirebaseAdapter_1.MessageFireBaseAdapter)),
    __metadata("design:paramtypes", [MessageFirebaseAdapter_1.MessageFireBaseAdapter])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=MessageService.js.map