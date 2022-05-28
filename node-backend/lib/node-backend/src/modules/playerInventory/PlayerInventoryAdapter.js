"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInventoryAdapter = exports.CHEST = exports.PLAYER_INVENTORY = void 0;
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const app_1 = require("../../app");
const tsyringe_1 = require("../../utils/tsyringe");
const firebase_admin_1 = require("firebase-admin");
exports.PLAYER_INVENTORY = "playerInventory";
exports.CHEST = "houseChest";
let PlayerInventoryAdapter = class PlayerInventoryAdapter {
    async savePlayerInventory(body) {
        await app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(body.playerId).set({
            playerInventory: body.playerInventory,
            playerId: body.playerId,
        }, { merge: true });
        return (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(body.playerId).get());
    }
    async savePlayerHouseInventory(itens, playerId) {
        await app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).set({
            playerHouseInventory: itens,
        }, { merge: true });
        return (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).get());
    }
    async savePlayerChest(playerId, itens) {
        await app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).set({
            playerHouseChest: itens
        }, { merge: true });
    }
    deletePlayerInventory(playerId) {
        return app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).delete();
    }
    async updateGold(playerId, amount) {
        app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).set({
            gold: amount
        }, { merge: true });
    }
    async addGoldToPlayer(playerId, amount) {
        await app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).set({
            gold: firebase_admin_1.firestore.FieldValue.increment(amount)
        }, { merge: true });
        return this.getPlayerInventory(playerId);
    }
    getPlayerInventory(playerId) {
        return (0, firestoreUtils_1.oneDocumentP)(app_1.adminDb.collection(exports.PLAYER_INVENTORY).doc(playerId).get());
    }
};
PlayerInventoryAdapter = __decorate([
    (0, tsyringe_1.Singleton)()
], PlayerInventoryAdapter);
exports.PlayerInventoryAdapter = PlayerInventoryAdapter;
//# sourceMappingURL=PlayerInventoryAdapter.js.map