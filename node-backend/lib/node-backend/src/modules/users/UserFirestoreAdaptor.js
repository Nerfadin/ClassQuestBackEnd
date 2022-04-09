"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserFirestoreAdaptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFirestoreAdaptor = void 0;
const app_1 = require("../../app");
const firebase_admin_1 = require("firebase-admin");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const errorUtils_1 = require("../../utils/errorUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const USER_REGISTER_TOKEN = "user_register_token";
const PLAYERS = "players";
const PLAYER_STATS = "player_statistics";
const TEACHERS = "teachers";
let UserFirestoreAdaptor = UserFirestoreAdaptor_1 = class UserFirestoreAdaptor {
    createTeacher(dto) {
        return app_1.adminDb.collection(TEACHERS).doc(dto.id).set({
            email: dto.email,
            institutions: [],
            nome: dto.nome,
            telefone: dto.telefone,
        });
    }
    getPlayer(id) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(PLAYERS).doc(id).get());
    }
    getPlayerStats(id) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(PLAYER_STATS).doc(id).get());
    }
    savePlayerStats(playerId, updateDto) {
        return app_1.adminDb
            .collection(PLAYER_STATS)
            .doc(playerId)
            .set(updateDto, { merge: true });
    }
    getTeacher(id) {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(TEACHERS).doc(id).get());
    }
    savePlayer(id, player) {
        return app_1.adminDb.collection(PLAYERS).doc(id).set(player, { merge: true });
    }
    createUserRegisterToken(email, institutionId) {
        const result = app_1.adminDb
            .collection(USER_REGISTER_TOKEN)
            .add({
            institutionId,
            email,
            createdAt: firebase_admin_1.firestore.FieldValue.serverTimestamp(),
        })
            .then((doc) => {
            return doc.id;
        });
        return result;
    }
    getUserRegisterToken(tokenId) {
        const token = firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(USER_REGISTER_TOKEN).doc(tokenId).get());
        return token;
    }
    deleteUserRegisterToken(tokenId) {
        const res = app_1.adminDb
            .collection(USER_REGISTER_TOKEN)
            .doc(tokenId)
            .delete()
            .catch((e) => {
            throw new errorUtils_1.UnexpectedError({
                message: "Error deleting token",
                details: e,
            });
        });
        return res;
    }
    updateTeacher(teacherId, update) {
        return app_1.adminDb.collection(TEACHERS).doc(teacherId).update(update);
    }
    incrementTeacherValues(teacherId, values) {
        var _a, _b, _c, _d;
        // TODO: (this) is not working because of circular DI
        return tsyringe_1.build(UserFirestoreAdaptor_1).updateTeacher(teacherId, {
            studentsCount: firebase_admin_1.firestore.FieldValue.increment((_a = values.studentsCount) !== null && _a !== void 0 ? _a : 0),
            publishedActivitiesCount: firebase_admin_1.firestore.FieldValue.increment((_b = values.publishedActivitiesCount) !== null && _b !== void 0 ? _b : 0),
            studentsCompletedActivityCount: firebase_admin_1.firestore.FieldValue.increment((_c = values.studentsCompletedActivityCount) !== null && _c !== void 0 ? _c : 0),
            points: firebase_admin_1.firestore.FieldValue.increment((_d = values.points) !== null && _d !== void 0 ? _d : 0),
        });
    }
};
UserFirestoreAdaptor = UserFirestoreAdaptor_1 = __decorate([
    tsyringe_1.Singleton()
], UserFirestoreAdaptor);
exports.UserFirestoreAdaptor = UserFirestoreAdaptor;
//# sourceMappingURL=UserFirestoreAdaptor.js.map