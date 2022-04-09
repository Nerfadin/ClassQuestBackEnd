import { EntityNotFoundError } from "../../utils/errorUtils";
import { adminDb } from "../../app";
import { oneDocumentP } from "../../utils/firestoreUtils";
import { GameVersiondto } from "./ConfigDTO";


export class GameVersionFirebaseAdapter {
async getAllowedGameVersion(){
    const gameVersionSnapshot = adminDb.collection("gameVersion").doc("version").get().catch (
        (err) => {throw err instanceof EntityNotFoundError ? new EntityNotFoundError ({
            type: "stat_Not_Found",
            message: "stats_not_found",
            details: err,

        }): err 
        })
    return oneDocumentP<GameVersiondto> (gameVersionSnapshot);  

}
}

