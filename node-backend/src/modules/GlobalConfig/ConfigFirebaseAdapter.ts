import { adminDb } from "../../app";
import { oneDocumentP } from "../../utils/firestoreUtils";
import { Singleton } from "../../utils/tsyringe";
import { ConfigDTO } from "./ConfigDTO";
const CONFIG = "Config";
const CONFIGDOC = "GameConfig";

@Singleton()
export class ConfigFirebaseAdapter {
    getConfigs() {
        return oneDocumentP<ConfigDTO>(adminDb.collection(CONFIG).doc(CONFIGDOC).get());    
    }
}
