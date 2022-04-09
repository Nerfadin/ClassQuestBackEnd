"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFirebaseAdapter = void 0;
const app_1 = require("../../app");
const firestoreUtils_1 = require("../../utils/firestoreUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const CONFIG = "Config";
const CONFIGDOC = "GameConfig";
let ConfigFirebaseAdapter = class ConfigFirebaseAdapter {
    getConfigs() {
        return firestoreUtils_1.oneDocumentP(app_1.adminDb.collection(CONFIG).doc(CONFIGDOC).get());
    }
};
ConfigFirebaseAdapter = __decorate([
    tsyringe_1.Singleton()
], ConfigFirebaseAdapter);
exports.ConfigFirebaseAdapter = ConfigFirebaseAdapter;
//# sourceMappingURL=ConfigFirebaseAdapter.js.map