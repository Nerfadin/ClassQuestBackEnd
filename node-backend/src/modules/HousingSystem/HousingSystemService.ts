import { Inject, Singleton } from "../../utils/tsyringe";
import { HouseErrors } from "./HousingErrors";
import { HouseFirebaseAdapter } from "./HousingSystemAdapter";
import { HouseDto } from "./HousingDtos";

@Singleton()
export class HouseService {
  constructor(
    @Inject(() => HouseFirebaseAdapter) private houseDao: HouseFirebaseAdapter
  ) { }
  async createHouse(playerId: string) {
    const house = await this.houseDao.hasHouse(playerId);
    if (!house) {
      const houseCreated = await this.houseDao
        .createHouse(playerId)
        .catch((error) => {
          throw HouseErrors.HouseCreateError(error);
        });
      return houseCreated;
    } else {
      throw HouseErrors.HouseAlreadyExist();
    }
  }
  async deleteHouse(playerId: string) {
    const houseId = await this.houseDao.getHouseId(playerId);
    return this.houseDao.deleteHouse(houseId)
  }
  async getHouse(playerId: string) {
    const house = await this.houseDao.getHouse(playerId).catch((error) => {
      throw HouseErrors.GetHouseError(error);
    });;
    return house;
  }
  async savePlayerHouse(body: HouseDto) {
    const houseId = await this.houseDao.getHouseId(body.ownerPlayerId);
    return this.houseDao.saveHouse(body, houseId);
  }
}
