export interface PlayerStats {
    str: number,
    agi: number,
    dex: number,
    vit: number
}
export interface PlayerStat {    
    stat: string,
    value: number
}
export interface ItemObject {
    id: number,
    amount: number
}

export interface SaveInventoryDto {
    inventory: ItemInventory,
    playerId: string,
    updateGold: boolean,
    goldAmount: number
}
export interface ItemInventory {
    playerId: string,
    ittens: ItemObject[],
    gold: number
}