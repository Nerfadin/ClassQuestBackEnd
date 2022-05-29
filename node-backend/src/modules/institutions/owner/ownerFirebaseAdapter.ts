import { adminDb } from '../../../app';
import { Singleton } from '../../../utils/tsyringe';
import { CreateOwnerDto, School, updateOwnedStatistics } from './ownerDto';
import { firestore } from 'firebase-admin';
import { manyDocumentsOrErrorP, oneDocumentP } from '../../../utils/firestoreUtils';
import { InstitutionInfo } from '../CreateInstitutionDto';
export const OWNER = "owner";
export const OWNEDINSTITUTIONS = "ownedInstitution";
import {SCHOOLS} from   '../InstitutionManagerAdapter'
@Singleton()
export class OwnerFirebaseAdapter {

    async getOwnerInstitutions(ownerId: string) {
        const ownedInstitutions = await adminDb.collection(OWNER).doc(ownerId).collection(OWNEDINSTITUTIONS);
        return manyDocumentsOrErrorP<InstitutionInfo> (ownedInstitutions.get());
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
    async CreateSchool (schools: School[]){
       const ownerId = 'QHISBM5KryaXQHmPNc2I'
       let createdSchools: School[] = [];
       schools['data'].map(async(schoolDto) => {
        const school = await adminDb.collection(SCHOOLS).add({
            "institutionType": "school",
            "institutionName": schoolDto.name,
            "institutionOwnerId": ownerId,
            "institutionCity": schoolDto.city,
            'ownerId': ownerId

        });
        await adminDb.collection(SCHOOLS).doc(school.id).set({
            "id":school.id 
        }, {merge: true});
        const schoolCreated = await oneDocumentP<School>(adminDb.collection(SCHOOLS).doc(school.id).get());
        createdSchools.push(schoolCreated);
       })
       console.log(createdSchools.length);
        return createdSchools;       
      }
      
}