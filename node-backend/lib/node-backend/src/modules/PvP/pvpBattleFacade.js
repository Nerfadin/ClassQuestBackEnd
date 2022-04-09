"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PvPFacade = void 0;
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const app_1 = require("../../app");
const tsyringe_1 = require("../../utils/tsyringe");
const QuestFirebaseAdaptor_1 = require("../quests/QuestFirebaseAdaptor");
const QuestFirebaseAdaptor_2 = require("../quests/QuestFirebaseAdaptor");
let PvPFacade = class PvPFacade {
    async getPvPQuests(questAmount, playerId) {
        const answredQuests = firestoreUtils_1.manyDocuments(await app_1.adminDb.collection(QuestFirebaseAdaptor_1.PLAYERS).doc(playerId).collection(QuestFirebaseAdaptor_2.ANSWERS).get());
        const questsIds = answredQuests.map((a) => {
            if (a.score > 0.6) {
                return a.id;
            }
            else if (a.score < 0.4) {
                return null;
            }
            else {
                return a.id;
            }
        });
        return questsIds;
    }
};
PvPFacade = __decorate([
    tsyringe_1.Singleton()
], PvPFacade);
exports.PvPFacade = PvPFacade;
//# sourceMappingURL=pvpBattleFacade.js.map