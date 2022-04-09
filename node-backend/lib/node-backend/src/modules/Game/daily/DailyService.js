"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyService = void 0;
const dayjs_1 = __importStar(require("dayjs"));
const firebase_admin_1 = require("firebase-admin");
const tsyringe_1 = require("../../../utils/tsyringe");
const DailyErrors_1 = require("./DailyErrors");
const DailyServiceFirebaseAdaptor_1 = require("./DailyServiceFirebaseAdaptor");
let DailyService = class DailyService {
    constructor(dailyServiceDao) {
        this.dailyServiceDao = dailyServiceDao;
    }
    async getCurrentProgress(userId) {
        const lastRewardInfo = await this.dailyServiceDao.getDaily(userId);
        const today = new Date();
        if (lastRewardInfo) {
            const daysDifference = getDaysDifference(lastRewardInfo.lastRewarded, today);
            if (daysDifference > 1) {
                // missed days
                return {
                    regressed: true,
                    previous: lastRewardInfo,
                    next: missedDailyReward(lastRewardInfo, daysDifference),
                };
            }
            const next = dailyRewardSuccess(lastRewardInfo, today);
            return {
                current: lastRewardInfo,
                next,
            };
        }
        else
            return {
                isFirst: true,
                next: firstDaily(),
            };
    }
    async claimDailyReward(userId) {
        const lastRewardInfo = await this.dailyServiceDao.getDaily(userId);
        const today = new Date();
        if (lastRewardInfo) {
            const daysDifference = getDaysDifference(lastRewardInfo.lastRewarded, today);
            if (daysDifference === 0) {
                throw DailyErrors_1.DailyErrors.AlreadyClaimed(lastRewardInfo.lastRewarded.toDate());
            }
            const claimedDaily = nextDailyReward(lastRewardInfo, today, daysDifference);
            await this.dailyServiceDao.saveDaily(userId, {
                currentDay: claimedDaily.day,
                chances: claimedDaily.chances,
                tier: claimedDaily.tier,
                lastRewarded: firebase_admin_1.firestore.Timestamp.fromDate(today),
            });
            return {
                itemId: 2,
            };
        }
        else {
            const daily = firstDaily();
            await this.dailyServiceDao.saveDaily(userId, {
                currentDay: daily.day,
                chances: daily.chances,
                tier: daily.tier,
                lastRewarded: firebase_admin_1.firestore.Timestamp.fromDate(today),
            });
            return {
                itemId: 1,
            };
        }
    }
};
DailyService = __decorate([
    tsyringe_1.Singleton(),
    __param(0, tsyringe_1.Inject(() => DailyServiceFirebaseAdaptor_1.DailyServiceFirebaseAdaptor)),
    __metadata("design:paramtypes", [DailyServiceFirebaseAdaptor_1.DailyServiceFirebaseAdaptor])
], DailyService);
exports.DailyService = DailyService;
function getDaysDifference(lastRewarded, today) {
    const lastRewardedDayjs = dayjs_1.default(lastRewarded.toDate());
    const daysDifference = dayjs_1.duration(dayjs_1.default(today).diff(lastRewardedDayjs)).days();
    return daysDifference;
}
function nextDailyReward(lastRewardInfo, today, daysDifference) {
    if (daysDifference === 1) {
        return dailyRewardSuccess(lastRewardInfo, today);
    }
    else
        return missedDailyReward(lastRewardInfo, daysDifference);
}
function firstDaily() {
    return {
        tier: 1,
        chances: 3,
        day: 1,
    };
}
function dailyRewardSuccess(lastRewardInfo, today) {
    const { nextDay, nextTier, nextChances } = nextProgression(lastRewardInfo);
    return {
        tier: nextTier,
        day: nextDay,
        chances: nextChances,
    };
}
const daysPerTier = {
    // tier : days
    1: 7,
    2: 13,
    3: 21,
};
// TODO: when do you get new chances?
function nextProgression({ currentDay, tier, chances, }) {
    const dayPlusOne = currentDay + 1;
    const nextTier = dayPlusOne > daysPerTier[tier]
        ? tier + 1 // update tier
        : tier; // same tier
    const didUpdateTier = nextTier !== tier;
    const nextDay = didUpdateTier ? 1 : dayPlusOne; // if updated tier, go to day 1
    const nextChances = didUpdateTier ? 3 : chances; // if updated tier, fill chances
    return {
        nextDay,
        nextTier,
        nextChances,
    };
}
function missedDailyReward(lastRewardInfo, daysDifference) {
    const chancesAfter = lastRewardInfo.chances - daysDifference;
    if (chancesAfter <= 0) {
        // if more than 3 days passed, go to initial stage
        return firstDaily();
    }
    return {
        tier: lastRewardInfo.tier,
        day: 1,
        chances: chancesAfter,
    };
}
//# sourceMappingURL=DailyService.js.map