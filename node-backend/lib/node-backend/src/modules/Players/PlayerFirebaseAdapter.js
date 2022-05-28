"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerFirebaseAdapter = exports.PLAYER_INVENTORY = void 0;
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const app_1 = require("../../app");
const tsyringe_1 = require("../../utils/tsyringe");
const firebase_admin_1 = require("firebase-admin");
const STATS = "characterStats";
exports.PLAYER_INVENTORY = "playerInventory";
let PlayerFirebaseAdapter = class PlayerFirebaseAdapter {
    getPlayerStats(playerId) {
        const playerStatsSnap = app_1.adminDb.collection(STATS).doc(playerId).get();
        return (0, firestoreUtils_1.oneDocumentP)(playerStatsSnap);
    }
    savePlayerStats(playerId, playerStats) {
        return app_1.adminDb.collection(STATS).doc(playerId).set({ playerStats });
        //return playerStatsDoc.set({ });
    }
    async createPlayerStats(playerId) {
        var playerStats = {};
        playerStats = {
            str: {
                stat: "str",
                value: 1,
            },
            agi: {
                stat: "agi",
                value: 1,
            },
            dex: {
                stat: "dex",
                value: 1,
            },
            vit: {
                stat: "vit",
                value: 1,
            },
        };
        await app_1.adminDb.collection(STATS).doc(playerId).set({
            freePoints: 0,
            playerStats,
        });
    }
    async savePlayerInventory(itens, playerId, updateGold = false, goldAmount = 0) {
        const inventoryUpdated = await app_1.adminDb
            .collection(exports.PLAYER_INVENTORY)
            .doc(playerId)
            .set({
            itens: itens,
            playerId: playerId,
        }, { merge: true })
            .then(() => {
            updateGold
                ? app_1.adminDb
                    .collection(exports.PLAYER_INVENTORY)
                    .doc(playerId)
                    .set({ gold: firebase_admin_1.firestore.FieldValue.increment(goldAmount) }, { merge: true })
                : "";
        });
        return inventoryUpdated;
    }
    getPlayerInventory(playerId) {
        return (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).get());
    }
};
PlayerFirebaseAdapter = __decorate([
    (0, tsyringe_1.Singleton)()
], PlayerFirebaseAdapter);
exports.PlayerFirebaseAdapter = PlayerFirebaseAdapter;
//# sourceMappingURL=PlayerFirebaseAdapter.js.map