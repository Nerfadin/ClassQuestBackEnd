"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manyDocumentsOrErrorP = exports.manyDocuments = exports.oneDocumentP = void 0;
const errorUtils_1 = require("./errorUtils");
async function oneDocumentP(promise) {
    return promise
        .then((doc) => {
        if (doc.exists) {
            return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
        }
        throw new errorUtils_1.EntityNotFoundError();
    })
        .catch((e) => {
        throw e instanceof errorUtils_1.EntityNotFoundError
            ? e
            : new errorUtils_1.UnexpectedError({ details: e });
    });
}
exports.oneDocumentP = oneDocumentP;
function manyDocuments(query) {
    return query.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { id: doc.id })));
}
exports.manyDocuments = manyDocuments;
async function manyDocumentsOrErrorP(promise) {
    try {
        const query = await promise;
        return query.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { id: doc.id })));
    }
    catch (e) {
        throw new errorUtils_1.UnexpectedError({ details: e });
    }
}
exports.manyDocumentsOrErrorP = manyDocumentsOrErrorP;
//# sourceMappingURL=firestoreUtils.js.map