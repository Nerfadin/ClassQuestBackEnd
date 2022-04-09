import { BadRequestError } from "../../utils/errorUtils";

export class DailyErrors {
  static AlreadyClaimed(lastClaimedAt: Date) {
    return new BadRequestError({
      type: "daily_reward_already_claimed",
      message: "Already claimed daily reward today.",
      details: {
        lastClaimedAt,
      },
    });
  }
}
