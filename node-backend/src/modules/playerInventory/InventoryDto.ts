export interface ItemObject {
  id: number;
  amount: number;
}
export interface SaveInventoryDto {
    playerInventory: ItemObject[];
    playerHouseInventory: ItemObject[];
    playerId: string;
    updateGold: boolean;
    updateHouseInventory: boolean;
    updatePlayerInventory: boolean;
    updateHouseChest: boolean;
    playerHouseChest: ItemObject[];
    goldAmount: number;
  }
  export interface ItemObject {
    id: number;
    amount: number;
  }
export interface chestDto {
  playerId: string;
  itens?: ItemObject[];
}

