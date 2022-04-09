import { Player } from "@interfaces/player";

export interface battleDto{
    
    players: Player[];
    winnerPlayerId: string;
    loserPlayerId: string;
    rounds: number;
    finalscore:battleScore;
    battleRounds: battleRound;

}
export interface battleRound {

}
export interface battleScore {
    playerId: string;
    isWinner: boolean;
    endAtLife: number;
    didFinishBattles: boolean;

}
export interface battleRound {

}