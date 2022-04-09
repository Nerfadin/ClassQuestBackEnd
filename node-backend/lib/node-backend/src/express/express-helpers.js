"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressErrorHandler = exports.returnFailureOrSuccessExpress = exports.reportFailureFunctions = exports.verifyAuthenticated = exports.checkDeviceId = exports.recoverPassword = void 0;
const firebase_functions_1 = __importDefault(require("firebase-functions"));
const app_1 = require("../app");
const errorUtils_1 = require("../utils/errorUtils");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const class_validator_1 = require("class-validator");
const serialize_error_1 = require("serialize-error");
async function recoverPassword(email) {
    app_1.adminAuth.generatePasswordResetLink(email);
}
exports.recoverPassword = recoverPassword;
function checkDeviceId() {
    return async (req, res, next) => {
        const savedId = req.headers.clouddeviceid;
        const currentId = req.headers.localdeviceid;
        if (savedId == null || currentId == null || currentId != savedId) {
            next(new errorUtils_1.AuthorizationError({
                message: "wrong device Id",
                type: "wrong_device_id",
            }));
            return;
        }
        else {
            console.log("inside else");
            next();
        }
    };
}
exports.checkDeviceId = checkDeviceId;
function verifyAuthenticated() {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            next(new errorUtils_1.AuthorizationError({
                message: "No user token",
                type: "missing_user_token",
            }));
            console.log("Im here");
            return;
        }
        try {
            const valid = await app_1.adminAuth.verifyIdToken(token);
            req.user = valid;
            next();
        }
        catch (e) {
            if (e.code === "auth/id-token-expired") {
                next(new errorUtils_1.AuthorizationError({
                    message: "Token expired",
                    details: e,
                    type: "token_expired",
                }));
            }
            else
                next(new errorUtils_1.AuthorizationError({
                    message: "Invalid user token",
                    details: e,
                    type: "invalid_user_token",
                }));
        }
    };
}
exports.verifyAuthenticated = verifyAuthenticated;
const reportFailureFunctions = (resultP) => resultP.catch(firebase_functions_1.default.logger.log);
exports.reportFailureFunctions = reportFailureFunctions;
/// DESCULPA, ESSA FUNÇÃO ESTÁ RUIM PQ EU TINHA PERDIDO ELA NO .gitignore E RECUPEREI SÓ
// O JAVASCRIPT COMPILADO, ENTÃO DEVE ESTAR HORRIVEL DE LER
function replaceFirestore(value, prop) {
    const obj = value;
    if (obj instanceof firebase_admin_1.default.firestore.DocumentReference) {
        // this[prop + "Id"] = obj.id;
        return undefined;
    }
    if (obj instanceof firebase_admin_1.default.firestore.WriteResult) {
        return {
            writeTime: obj.writeTime.toDate(),
        };
    }
    if (obj instanceof firebase_admin_1.default.firestore.Timestamp) {
        return obj.toDate();
    }
    for (const prop in obj) {
        if (obj[prop]) {
            if (typeof obj[prop] === "object") {
                obj[prop] = replaceFirestore.call(value, obj[prop], prop);
            }
            if (Array.isArray(obj[prop])) {
                obj[prop] = obj[prop].map((o) => replaceFirestore.call(value, o));
            }
        }
    }
    return obj;
}
// const firebaseExtractor = function (key, val) {
//   const firestore = val["_firestore"] || val["firestore"];
//   if (typeof val == "object" && firestore) {
//     this[key + "Id"] = val["id"];
//     return undefined;
//   } else return val;
// };
function returnFailureOrSuccessExpress(resultF, removeFirebase = true) {
    return (req, res, next) => resultF(req, req.user)
        .then((result) => {
        res.send(class_validator_1.isNotEmpty(result)
            ? {
                data: removeFirebase
                    ? replaceFirestore.call({}, result)
                    : result,
            }
            : {});
    })
        .catch((err) => {
        next(err);
    });
}
exports.returnFailureOrSuccessExpress = returnFailureOrSuccessExpress;
const expressErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        error: serialize_error_1.serializeError(err),
    });
};
exports.expressErrorHandler = expressErrorHandler;
//# sourceMappingURL=express-helpers.js.map