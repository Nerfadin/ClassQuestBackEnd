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
  grids: GridDto[];
  furniture: FurnitureDto[];
}
export interface GridDto {  
  GridPosX: number;
  GridPosY: number;
  isActive: boolean;
  Furnitures: FurnitureDto[];
}
export interface FurnitureDto {
  gridX: number;
  gridY: number;
  furnitureId: string;
  houseId: string;
}
