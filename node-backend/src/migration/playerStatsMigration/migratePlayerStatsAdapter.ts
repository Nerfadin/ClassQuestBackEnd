 //import { manyDocuments } from "../../utils/firestoreUtils";
import { arrayContains } from "class-validator";
import { adminDb } from "../../app";
import { Inject, Singleton } from "../../utils/tsyringe";
//import { Player } from "@interfaces/player";
import { PlayerFirebaseAdapter } from "../../modules/Players/PlayerFirebaseAdapter";
const PLAYERS = "players"
const playersWithStats = ["25R9xNNruRbWTPAGiYNSS81zyL43",
"JkM8VQEk9SS6vbP5CyywVxPxsvi1",
"PzmEnnUfWzQtU6ijfaCiR7sLOJv1",
"RIhcLov5Hph70R9QxlXaKf5S2tE3",
"aRYofnHLXCgcQOeyuCHUIW8id0y2",
"gGdf1pnidCTXkqwjfyyqsUwOxWn1",
"i9qvhzheamagXEcw2j2wBXtVuBp1",
"iY5mypJ3Wwd4i2MSE6WFexqAEsp1",
"pSOBdK0PK8X13clm8D5947MBfgI2",
"udq9P2UPjbYAYqhFMg1OaQPY4HV2",
"ycIlSnwK74SoupjpGBeZGYCD7tj2"]
//const CHARACTERSTATS = "characterStats";
@Singleton()
export class PlayerMigration {
    
    constructor (
       @Inject(() => PlayerFirebaseAdapter) private playerService: PlayerFirebaseAdapter,
    )    {}
        async LoopAndCreateStats (){
            const playersWithStats =  await adminDb.collection (PLAYERS).get().then ((characterStats) => {
                return characterStats.docs.map(async(playerId) => {
                   await this.createPlayerStats(playerId.id);
                })
            })       
            return playersWithStats
        }
        async createPlayerStats (playerId: string){
                if(!arrayContains(playersWithStats, [playerId])){
                    await this.playerService.createPlayerStats(playerId)
                }
                
                
        }

    }
    /*    async createPlayerStatForEveryPlayer(){       
        await adminDb.collection(PLAYERS).get().then ((player) => {
          const p = manyDocuments<Player> (player);
          try{
              const stat = async() =>{ await this.playerService.getPlayerStats(p[0].id)}
                if (stat == null){
                    console.log (p[0].id);
                    console.log(p[0].playerName);
                    
                }
            }catch(err) {
                    console.log ("inside catch"+ err)
          }
          return p;
                  this.playerService.createPlayerStats(player[0].id)
          
       })
    }
}*/