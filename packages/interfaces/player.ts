export interface Head {
  name: string;
  id: number;
  qnt: number;
}

export interface LeftHand {
  name: string;
  id: number;
  qnt: number;
}

export interface RightHand {
  name: string;
  id: number;
  qnt: number;
}

export interface Back {
  name: string;
  id: number;
  qnt: number;
}

export interface EquippedItems {
  head: Head;
  leftHand: LeftHand;
  rightHand: RightHand;
  back: Back;
}

export interface Player {
  playerName: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  gold: number;
  gender: string;
  level: number;
  currentExp: number;
  currentHealth: number;
  maxHealth: number;
  equippedItems: EquippedItems;
  groupIds: string[]
  questIds: string[];
  characterCreated: boolean
  inventory: any[]
}

export interface PlayerStats {
  id: string;
  completedQuestsCount: number;
  completedQuests: Record<string, boolean>;
}
