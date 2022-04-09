import { Timestamp } from "./quest";

export type GlobalShop = {
  nextRefreshAt: Timestamp;
  items: number[];
};
