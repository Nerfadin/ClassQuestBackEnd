"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const tsyringe_1 = require("../../utils/tsyringe");
const TimerFirebaseAdaptor_1 = require("./TimerFirebaseAdaptor");
let TimerService = class TimerService {
    constructor(timerDao) {
        this.timerDao = timerDao;
    }
    saveTimer(userId, dto) {
        const now = (0, dayjs_1.default)();
        const expiresAt = now.add(dayjs_1.default.duration(dto.expiresIn).asMilliseconds(), "millisecond");
        return this.timerDao.saveEvent(userId, {
            [dto.name]: expiresAt.toDate(),
        });
    }
    deleteTimer(userId, name) {
        return this.timerDao.saveEvent(userId, {
            [name]: firebase_admin_1.default.firestore.FieldValue.delete(),
        });
    }
    async getTimer(userId, name) {
        const timers = await this.timerDao.getEvents(userId);
        const value = timers[name];
        if (!value)
            return {
                isExpired: true,
            };
        const expiresAt = (0, dayjs_1.default)(value.toDate());
        const now = (0, dayjs_1.default)();
        const expiresIn = expiresAt.diff(now);
        if (expiresIn > 0) {
            return {
                isExpired: false,
                expiresIn: toDurationDto(dayjs_1.default.duration(expiresIn)),
            };
        }
        return {
            isExpired: true,
        };
    }
};
TimerService = __decorate([
    (0, tsyringe_1.Singleton)(),
    __param(0, (0, tsyringe_1.Inject)(() => TimerFirebaseAdaptor_1.TimerFirebaseAdaptor)),
    __metadata("design:paramtypes", [TimerFirebaseAdaptor_1.TimerFirebaseAdaptor])
], TimerService);
exports.TimerService = TimerService;
function toDurationDto(duration) {
    return Object.assign({}, duration)["$d"];
}
//# sourceMappingURL=TimerService.js.map