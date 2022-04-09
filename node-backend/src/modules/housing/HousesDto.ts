import { Timestamp } from "@interfaces/quest";
export interface HouseDto {
  houseLevel: number;
  ownerPlayerId: string;
  rented: boolean;
  revenue: number;
  createdAt: Timestamp;
  houseId: string;
  grids: GridDto[];
}
export interface houseGrid {
  grids: GridDto[];
}
export interface SaveHouseDto {
  houseId: string;
  playerId: string;
  furniture: FurnitureDto[];
}
export interface GridDto {  
  GridPosX: number;
  isActive: boolean;
  GridPosY: number;
  Furnitures: FurnitureDto[];
}
export interface FurnitureDto {
  gridX: number;
  gridY: number;
  furnitureId: string;
  houseId: string;
}
