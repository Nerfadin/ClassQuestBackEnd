import { adminDb } from '../../../app';
import { Singleton } from '../../../utils/tsyringe';
import { CreateOwnerDto, updateOwnedStatistics } from './ownerDto';
import { firestore } from 'firebase-admin';
export const OWNER = "owner";
export const OWNEDINSTITUTIONS = "ownedInstitution";

@Singleton()
export class OwnerFirebaseAdapter {

    async getOwnerInstitutions(ownerId: string) {
        const ownedInstitutions = await adminDb.collection(OWNER).doc(ownerId).collection(OWNEDINSTITUTIONS).get();
        return ownedInstitutions.docs.map((i) => {
            return i.data
        })
    }
    async CreateOwner(owner: CreateOwnerDto) {
        const ownerId = await adminDb.collection(OWNER).add(
            {
                ...owner,
                CreatedAt: firestore.Timestamp.fromDate(new Date()),
                ownerBillingDate: firestore.Timestamp.fromDate(new Date())
            });
        return (await adminDb.collection(OWNER).where("ownerId", "==", ownerId.id).get()).docs[0];
    
    }
    async UpdateOwnerStatistics(ownerId: string, updateStatistics: updateOwnedStatistics) {
        await adminDb.collection(OWNER).doc(ownerId).update({
            quests: updateStatistics.questCountAdd,
            teachers: updateStatistics.teacherCountAdd,
            players: updateStatistics.playerCountAdd
        })

    }
    //institution A: QHISBM5KryaXQHmPNc2I
    //institution B: UrbAWDBVjXBks92Hy3S1
    //institution C: GnsZj4Ywiwy56SIKdTUn
    async addInstitutionToOwner(ownerId: string, institutionId: string,) {
        await adminDb.collection(OWNER).doc(ownerId).collection(OWNEDINSTITUTIONS).doc(institutionId).set({
            institutionId: institutionId,
            ownerId: ownerId,
        });
    }
}