"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questInGroupFirestoreToQuestInGroupDto = exports.questFirestoreToQuestDto = void 0;
function questFirestoreToQuestDto(quest) {
    const questDto = Object.assign(Object.assign({}, quest), { questions: Object.entries(quest.questions).map(([id, question]) => {
            var _a;
            return (Object.assign(Object.assign({}, question), { id, content: Object.entries((_a = question.content) !== null && _a !== void 0 ? _a : {}).map(([contentId, content]) => (Object.assign(Object.assign({}, content), { id: contentId }))), answers: Object.entries(question.answers).map(([answerId, answer]) => (Object.assign(Object.assign({}, answer), { id: answerId }))) }));
        }) });
    return questDto;
}
exports.questFirestoreToQuestDto = questFirestoreToQuestDto;
function questInGroupFirestoreToQuestInGroupDto(quest) {
    const questInGroup = Object.assign(Object.assign({}, quest), questFirestoreToQuestDto(quest));
    return questInGroup;
}
exports.questInGroupFirestoreToQuestInGroupDto = questInGroupFirestoreToQuestInGroupDto;
//# sourceMappingURL=questFirestoreToQuestDto.js.map