import { Timestamp } from "../../../../packages/interfaces/quest";

export type PlayerDailyRewardDto = {
  lastRewarded: Timestamp;
  tier: number; // 1-7
  currentDay: number;
  chances: number; // 1-3
};
export type DailyReward = {
  tier: number; // 1-7
  day: number;
  chances: number; // 1-3
};
