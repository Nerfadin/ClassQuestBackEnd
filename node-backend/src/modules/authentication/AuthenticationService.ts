import { LoginDto } from "./models/LoginDto";
import { AuthenticationHttpAdaptor } from "./AuthenticationHttpAdaptor";
import { RegisterDtoStepTwo, RegisterDtoStepOne} from "./models/RegisterDto";
import { Singleton, Inject } from "../../utils/tsyringe";
import { UserService } from "../users/UserService";
import { Player } from "../../../../packages/interfaces/player";
import { DeviceIdAdapter } from "./deviceIdAdapter";
const playerBaseStats: Partial<Player> = {
  email: "",
  firstName: "",
  lastName: "",
  currentHealth: 100,
  maxHealth: 100,
  gender: "",
  playerName: "",
  groupIds: [],
  questIds: [],
  inventory: [],
  level: 1,
  gold: 130,
};
@Singleton()
export class AuthenticationService {
  constructor(
    @Inject(() => AuthenticationHttpAdaptor)
    private authenticationDao: AuthenticationHttpAdaptor,
    @Inject(() => UserService) private userService: UserService,
    @Inject(() => DeviceIdAdapter) private deviceIdAdapter: DeviceIdAdapter,    
  ) {
  }
  
  login(loginDto: LoginDto) {
    return this.authenticationDao.login(loginDto);
  }
  async createDeviceId(playerId: string){
    return this.deviceIdAdapter.createDeviceId(playerId);
  }
  async getDeviceId(playerId: string){
    return this.deviceIdAdapter.getDeviceCloudId(playerId);
  }
  async registerAnonymously(name: string) {
    const register = await this.authenticationDao.register();
    await this.userService.savePlayerStats(register.localId, {
      completedQuests: {},
      completedQuestsCount: 0,
    });
    await this.userService.savePlayer(register.localId, {
      ...playerBaseStats,
      playerName: name,
      characterCreated: true,
    });
    return register;
  }

  async registerStepOne(registerDto: RegisterDtoStepOne) {
    const register = await this.authenticationDao.register(registerDto);
    await this.userService.savePlayerStats(register.localId, {
      completedQuests: {},
      completedQuestsCount: 0,
    });
    await this.userService.savePlayer(register.localId, {
      ...playerBaseStats,
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      characterCreated: false,
    });
    return register;
  }
  async updateCustomClaims(){
    
  }
  async RegisterTeacher(email: string, password: string){
    const teacher = await this.authenticationDao.registerTeacher(email, password);
    return teacher;
  }
  async registerPlayerWithInstitution(registerDto: RegisterDtoStepOne, institutionID: string) {
    const register = await this.authenticationDao.register(registerDto);
    await this.userService.savePlayerStats(register.localId, {
      completedQuests: {},
      completedQuestsCount: 0,
    });    
    await this.userService.savePlayer(register.localId, {
      ...playerBaseStats,
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      characterCreated: false,
    });
    return register;
  }
  registerStepTwo(registerDto: RegisterDtoStepTwo, userId: string) {
    return this.userService
      .savePlayer(userId, {
        playerName: registerDto.playerName,
        gender: registerDto.gender,
        characterCreated: true,
      })
      .then(() => this.userService.getPlayer(userId));
  }

  refreshToken = this.authenticationDao.refreshToken;
}

export function isNonAnonymousRegister(obj: any): obj is RegisterDtoStepOne {
  return obj.email && obj.password;
}
