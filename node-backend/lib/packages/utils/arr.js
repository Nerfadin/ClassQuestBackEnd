"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includesAll = exports.includesAny = void 0;
function includesAny(arr, includesAny) {
    return arr.some((r) => includesAny.includes(r));
}
exports.includesAny = includesAny;
function includesAll(arr, includesAny) {
    return arr.every((r) => includesAny.includes(r));
}
exports.includesAll = includesAll;
//# sourceMappingURL=arr.js.map