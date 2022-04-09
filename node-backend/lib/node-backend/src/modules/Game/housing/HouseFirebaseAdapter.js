"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseFirebaseAdapter = exports.GRID = exports.HOUSES = void 0;
const app_1 = require("../../../app");
const firebase_admin_1 = require("firebase-admin");
const firestoreUtils_1 = require("../../../utils/firestoreUtils");
const tsyringe_1 = require("../../../utils/tsyringe");
exports.HOUSES = "houses";
exports.GRID = "grid";
let HouseFirebaseAdapter = class HouseFirebaseAdapter {
    async createHouse(playerId) {
        const house = await app_1.adminDb
            .collection(exports.HOUSES)
            .add({
            houseLevel: 1,
            ownerPlayerId: playerId,
            rented: false,
            revenue: 0,
            createdAt: firebase_admin_1.firestore.Timestamp.fromDate(new Date()),
            houseId: "",
        })
            .then((snapshot) => {
            snapshot.set({
                houseid: snapshot.id,
            }, { merge: true });
        });
        return house;
    }
    async getHouse(playerId) {
        const house = await firestoreUtils_1.manyDocumentsOrErrorP(app_1.adminDb.collection(exports.HOUSES).where("ownerPlayerId", "==", playerId).get());
        return house;
    }
    async hasHouse(playerId) {
        const result = await app_1.adminDb
            .collection(exports.HOUSES)
            .where("ownerPlayerId", "==", playerId)
            .get()
            .then(function (snapshot) {
            if (snapshot.empty) {
                return false;
            }
            else {
                return true;
            }
        });
        return result;
    }
    async getHouseId(playerId) {
        return await app_1.adminDb
            .collection(exports.HOUSES)
            .where("ownerPlayerId", "==", playerId)
            .limit(1)
            .get()
            .then((querrySnapshot) => {
            return querrySnapshot.docs[0].id;
        });
    }
    saveHouse(body, houseId) {
        app_1.adminDb.collection(exports.HOUSES).doc(houseId).set(Object.assign({}, body));
    }
};
HouseFirebaseAdapter = __decorate([
    tsyringe_1.Singleton()
], HouseFirebaseAdapter);
exports.HouseFirebaseAdapter = HouseFirebaseAdapter;
//# sourceMappingURL=HouseFirebaseAdapter.js.map