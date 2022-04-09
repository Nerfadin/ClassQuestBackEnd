"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerFirebaseAdapter = void 0;
const app_1 = require("../../../app");
const tsyringe_1 = require("../../../utils/tsyringe");
let OwnerFirebaseAdapter = class OwnerFirebaseAdapter {
    async getOwnerInstitutions(ownerId) {
        return app_1.adminDb.collection("institutions").where("ownedBy", "==", ownerId).get();
    }
};
OwnerFirebaseAdapter = __decorate([
    tsyringe_1.Singleton()
], OwnerFirebaseAdapter);
exports.OwnerFirebaseAdapter = OwnerFirebaseAdapter;
//# sourceMappingURL=ownerFirebaseAdapter.js.map