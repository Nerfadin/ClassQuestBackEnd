"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanEmptyElements = void 0;
function cleanEmptyElements(arr) {
    var newArray = arr.filter((value) => Object.keys(value).length !== 0);
    return newArray;
}
exports.cleanEmptyElements = cleanEmptyElements;
//# sourceMappingURL=arrayUtils.js.map