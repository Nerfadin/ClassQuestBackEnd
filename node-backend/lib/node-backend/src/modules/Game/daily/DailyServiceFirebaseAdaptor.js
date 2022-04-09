"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyServiceFirebaseAdaptor = void 0;
const app_1 = require("../../../app");
const errorUtils_1 = require("../../../utils/errorUtils");
const firestoreUtils_1 = require("../../../utils/firestoreUtils");
const tsyringe_1 = require("../../../utils/tsyringe");
let DailyServiceFirebaseAdaptor = class DailyServiceFirebaseAdaptor {
    saveDaily(userId, playerDailyReward) {
        return app_1.adminDb
            .collection("daily")
            .doc(userId)
            .set(playerDailyReward, { merge: true });
    }
    getDaily(userId) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection("daily").doc(userId).get()).catch((e) => {
            if (e instanceof errorUtils_1.EntityNotFoundError)
                return undefined;
            else
                throw e;
        });
    }
};
DailyServiceFirebaseAdaptor = __decorate([
    tsyringe_1.Singleton()
], DailyServiceFirebaseAdaptor);
exports.DailyServiceFirebaseAdaptor = DailyServiceFirebaseAdaptor;
//# sourceMappingURL=DailyServiceFirebaseAdaptor.js.map