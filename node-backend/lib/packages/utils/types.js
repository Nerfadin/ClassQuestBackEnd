"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMultiChoice = exports.isSingleChoice = exports.isScaleQuestion = void 0;
function isScaleQuestion(q) {
    return (q === null || q === void 0 ? void 0 : q.type) === "scale";
}
exports.isScaleQuestion = isScaleQuestion;
function isSingleChoice(q) {
    return (q === null || q === void 0 ? void 0 : q.type) === "single-choice";
}
exports.isSingleChoice = isSingleChoice;
function isMultiChoice(q) {
    return (q === null || q === void 0 ? void 0 : q.type) === "multiple-choices";
}
exports.isMultiChoice = isMultiChoice;
//# sourceMappingURL=types.js.map