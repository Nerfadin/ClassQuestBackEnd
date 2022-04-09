//cimport { CreateInstitutionDto } from '../../modules/institutions/CreateInstitutionDto';
import { Singleton } from '../../utils/tsyringe';
import {adminDb} from '../../app';
import { manyDocumentsOrErrorP } from '../../utils/firestoreUtils';
import { InstitutionInfo } from '@interfaces/institution';
export const INSTITUTIONS = "institutions";

@Singleton()
export class InstitutionMigrationAdapter {
    async getAllInstitutions(){
      const institutions = await manyDocumentsOrErrorP<InstitutionInfo>(adminDb.collection(INSTITUTIONS).get());
      const institutionsIds = institutions.map((i) => {
        return i.id
      })      
      return institutionsIds;
    }
    async addInstitutionType(institutionType: string) {
      const institutionIds = await this.getAllInstitutions();
      institutionIds.map((institutionId) =>{
        adminDb.collection(INSTITUTIONS).doc(institutionId).set ({
          institutionType: institutionType
        }, {merge: true});
      })
      adminDb.collection(INSTITUTIONS).doc(institutionIds[0]).set({
        institutionType: "teacher"
      }) 
      return await adminDb.collection(INSTITUTIONS).doc(institutionIds[0]).get();      
    }
    addInstitutionOwner(institutionOwner: string, institution: string) {
      adminDb.collection(INSTITUTIONS).doc(institution).set({
        owner: institutionOwner
      }, {merge: true});
    }
}