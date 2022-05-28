"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerFirebaseAdaptor = void 0;
const app_1 = require("../../app");
const errorUtils_1 = require("../../utils/errorUtils");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const TIMERS = "timers";
let TimerFirebaseAdaptor = class TimerFirebaseAdaptor {
    saveEvent(userId, update) {
        return app_1.adminDb.collection(TIMERS).doc(userId).set(update, { merge: true });
    }
    getEvents(userId) {
        return (0, firestoreUtils_1.oneDocumentP)(// TODO: TeacherInstitutionPlan
        app_1.adminDb.collection(TIMERS).doc(userId).get()).catch((err) => {
            if (err instanceof errorUtils_1.EntityNotFoundError) {
                return { id: userId };
            }
            else
                throw err;
        });
    }
};
TimerFirebaseAdaptor = __decorate([
    (0, tsyringe_1.Singleton)()
], TimerFirebaseAdaptor);
exports.TimerFirebaseAdaptor = TimerFirebaseAdaptor;
//# sourceMappingURL=TimerFirebaseAdaptor.js.map