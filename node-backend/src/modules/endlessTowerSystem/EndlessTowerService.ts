import { TowerFirebaseAdapter } from './EndlessTowerAdapter';
import { Singleton, Inject } from "../../utils/tsyringe";
import { CreateTowerDto, CreateTowerQuestDto } from './EndlessTowerDtos';

@Singleton()
export class TowerService {
    constructor(
        @Inject(() => TowerFirebaseAdapter) private  towerDao: TowerFirebaseAdapter
    ){
    }
    async createTower(body: CreateTowerDto){
        return await this.towerDao.createTower(body);
    }
    async getTower(towerId: string){
        return this.towerDao.getTower(towerId);
    }
    async createQuest(body: CreateTowerQuestDto){
        this.towerDao.createTowerQuest(body);
    }
}