"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.adminDb = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const classquest_2bb7d_b9a69fcf5d24_json_1 = __importDefault(require("../../packages/utils/classquest-2bb7d-b9a69fcf5d24.json"));
dayjs_1.default.extend(duration_1.default);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(classquest_2bb7d_b9a69fcf5d24_json_1.default),
});
exports.adminDb = firebase_admin_1.default.firestore();
exports.adminAuth = firebase_admin_1.default.auth();
//# sourceMappingURL=app.js.map