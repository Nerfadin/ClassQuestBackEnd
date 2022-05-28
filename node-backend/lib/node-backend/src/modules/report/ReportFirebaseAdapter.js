"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFirebaseAdapter = void 0;
const app_1 = require("../../app");
const tsyringe_1 = require("tsyringe");
const REPORTS = "reports";
let ReportFirebaseAdapter = class ReportFirebaseAdapter {
    async getReport(questid) {
        return app_1.adminDb.collection(REPORTS).doc(questid);
    }
    async CreateReport(questReport) {
    }
};
ReportFirebaseAdapter = __decorate([
    (0, tsyringe_1.singleton)()
], ReportFirebaseAdapter);
exports.ReportFirebaseAdapter = ReportFirebaseAdapter;
//# sourceMappingURL=ReportFirebaseAdapter.js.map