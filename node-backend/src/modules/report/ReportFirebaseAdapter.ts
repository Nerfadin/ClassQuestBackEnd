import { adminDb } from "../../app";
import { singleton } from "tsyringe";
import { GetSingleReportDto } from "@interfaces/routes/GetSingleReportDto";

const REPORTS = "reports";


@singleton()
export class ReportFirebaseAdapter {

    async getReport (questid: string){

        return adminDb.collection (REPORTS).doc(questid) 
    } 

    async CreateReport (questReport: GetSingleReportDto){

    }

}