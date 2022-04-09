import { Inject, Singleton } from "../../utils/tsyringe";
import { ConfigFirebaseAdapter } from "./ConfigFirebaseAdapter";


@Singleton()
export class ConfigService {
    constructor(
        @Inject(() => ConfigFirebaseAdapter) private configService: ConfigFirebaseAdapter,
    ) { }
    getConfig = this.configService.getConfigs
}