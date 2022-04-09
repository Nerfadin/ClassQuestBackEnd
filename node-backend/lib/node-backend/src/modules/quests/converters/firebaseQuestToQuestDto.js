"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questFirestoreToQuestDto = void 0;
function questFirestoreToQuestDto(quest) {
    const questDto = Object.assign(Object.assign({}, quest), { questions: quest.questions = Object.entries(quest.questions).map(([id, question]) => {
            var _a;
            return (Object.assign(Object.assign({}, question), { id: Number(id), content: Object.entries((_a = question.content) !== null && _a !== void 0 ? _a : {}).map(([id, content]) => (Object.assign(Object.assign({}, content), { id: Number(id) }))), answers: Object.entries(question.answers).map(([id, answer]) => (Object.assign(Object.assign({}, answer), { id: Number(id) }))) }));
        }) });
    return questDto;
}
exports.questFirestoreToQuestDto = questFirestoreToQuestDto;
//# sourceMappingURL=firebaseQuestToQuestDto.js.map