import dayjs, { duration } from "dayjs";
import { firestore } from "firebase-admin";
import { Timestamp } from "../../../../packages/interfaces/quest";
import { Inject, Singleton } from "../../utils/tsyringe";
import { DailyErrors } from "./DailyErrors";
import { DailyServiceFirebaseAdaptor } from "./DailyServiceFirebaseAdaptor";
import { DailyReward, PlayerDailyRewardDto } from "./PlayerDailyReward";
type LostStreak = {
  regressed: true;
  previous: PlayerDailyRewardDto;
  next: DailyReward;
};
type FirstTime = {
  current: PlayerDailyRewardDto;
  next: DailyReward;
};
type Default = {
  isFirst: true;
  next: DailyReward;
};

type GetCurrentProgressReturn = FirstTime | LostStreak | Default;

@Singleton()
export class DailyService {
  constructor(
    @Inject(() => DailyServiceFirebaseAdaptor)
    private dailyServiceDao: DailyServiceFirebaseAdaptor
  ) {}

  async getCurrentProgress(userId: string): Promise<GetCurrentProgressReturn> {
    const lastRewardInfo = await this.dailyServiceDao.getDaily(userId);
    const today = new Date();
    if (lastRewardInfo) {
      const daysDifference = getDaysDifference(
        lastRewardInfo.lastRewarded,
        today
      );
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
    } else
      return {
        isFirst: true,
        next: firstDaily(),
      };
  }

  async claimDailyReward(userId: string) {
    const lastRewardInfo = await this.dailyServiceDao.getDaily(userId);
    const today = new Date();
    if (lastRewardInfo) {
      const daysDifference = getDaysDifference(
        lastRewardInfo.lastRewarded,
        today
      );
      if (daysDifference === 0) {
        throw DailyErrors.AlreadyClaimed(lastRewardInfo.lastRewarded.toDate());
      }
      const claimedDaily = nextDailyReward(
        lastRewardInfo,
        today,
        daysDifference
      );
      await this.dailyServiceDao.saveDaily(userId, {
        currentDay: claimedDaily.day,
        chances: claimedDaily.chances,
        tier: claimedDaily.tier,
        lastRewarded: firestore.Timestamp.fromDate(today),
      });
      return {
        itemId: 2,
      };
    } else {
      const daily = firstDaily();
      await this.dailyServiceDao.saveDaily(userId, {
        currentDay: daily.day,
        chances: daily.chances,
        tier: daily.tier,
        lastRewarded: firestore.Timestamp.fromDate(today),
      });
      return {
        itemId: 1,
      };
    }
  }
}

function getDaysDifference(lastRewarded: Timestamp, today: Date) {
  const lastRewardedDayjs = dayjs(lastRewarded.toDate());
  const daysDifference = duration(dayjs(today).diff(lastRewardedDayjs)).days();
  return daysDifference;
}

function nextDailyReward(
  lastRewardInfo: PlayerDailyRewardDto,
  today: Date,
  daysDifference: number
): DailyReward {
  if (daysDifference === 1) {
    return dailyRewardSuccess(lastRewardInfo, today);
  } else return missedDailyReward(lastRewardInfo, daysDifference);
}

function firstDaily() {
  return {
    tier: 1,
    chances: 3,
    day: 1,
  } as DailyReward;
}

function dailyRewardSuccess(lastRewardInfo: PlayerDailyRewardDto, today: Date) {
  const { nextDay, nextTier, nextChances } = nextProgression(lastRewardInfo);
  return {
    tier: nextTier,
    day: nextDay,
    chances: nextChances,
  } as DailyReward;
}
const daysPerTier = {
  // tier : days
  1: 7,
  2: 13,
  3: 21,
};
// TODO: when do you get new chances?
function nextProgression({
  currentDay,
  tier,
  chances,
}: {
  currentDay: number;
  tier: number;
  chances: number;
}) {
  const dayPlusOne = currentDay + 1;
  const nextTier =
    dayPlusOne > daysPerTier[tier]
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
function missedDailyReward(
  lastRewardInfo: PlayerDailyRewardDto,
  daysDifference: number
) {
  const chancesAfter = lastRewardInfo.chances - daysDifference;
  if (chancesAfter <= 0) {
    // if more than 3 days passed, go to initial stage
    return firstDaily();
  }
  return {
    tier: lastRewardInfo.tier,
    day: 1,
    chances: chancesAfter,
  } as DailyReward;
}
