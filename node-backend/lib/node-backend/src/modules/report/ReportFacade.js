/*import { adminDb } from "../../app";
import {Singleton, Inject } from "../../utils/tsyringe";

import { GetSingleReportDto } from "@interfaces/routes/GetSingleReportDto";
import { QuestService } from "../quests/QuestService";

@Singleton()
export class ReportsFacade {

    constructor (
        @Inject (() => QuestService)private questService: QuestService)
    {

    }
    /*async createReportInReportsCollection (questId: string): Promise<GetSingleReportDto>{
        const report = await this.questService.getReport(questId);

        return report;
    }*/
//# sourceMappingURL=ReportFacade.js.map