"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyErrors = void 0;
const errorUtils_1 = require("../../utils/errorUtils");
class DailyErrors {
    static AlreadyClaimed(lastClaimedAt) {
        return new errorUtils_1.BadRequestError({
            type: "daily_reward_already_claimed",
            message: "Already claimed daily reward today.",
            details: {
                lastClaimedAt,
            },
        });
    }
}
exports.DailyErrors = DailyErrors;
//# sourceMappingURL=DailyErrors.js.map