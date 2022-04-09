import { adminDb } from "../../app";
import { manyDocuments, oneDocumentP } from "../../utils/firestoreUtils";
import { AlertConfigDto, AlertDto } from "./AlertsDto";
export const ALERTS = "alerts";
export const ALERTCONFIG = "alertConfig";
export const CONFIG = "Config";



export class AlertFirebaseAdapter {
    getAlertConfig() {
        return oneDocumentP<AlertConfigDto>(adminDb
            .collection(CONFIG)
            .doc(ALERTCONFIG)
            .get());
    }
    async fetchActiveAlerts() {
        return manyDocuments <AlertDto> (
            await adminDb
                .collection(ALERTS)
                .get());
    }
    //        return alerts.then((alerts) => )
/*alertCount
*hasAlert
*requiredAlret
*/



}
