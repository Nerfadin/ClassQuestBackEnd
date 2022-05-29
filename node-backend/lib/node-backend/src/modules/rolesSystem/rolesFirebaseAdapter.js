"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.f = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
function f() {
    return (0, firestoreUtils_1.manyDocumentsOrErrorP)(app_1.adminDb.collection('teachers').get());
}
exports.f = f;
//# sourceMappingURL=rolesFirebaseAdapter.js.map