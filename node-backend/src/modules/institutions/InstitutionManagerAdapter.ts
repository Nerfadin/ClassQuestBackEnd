import { Singleton } from "../../utils/tsyringe";
//import { BadRequestError } from "../../utils/errorUtils";
import {adminDb} from '../../app';
import {INSTITUTIONS} from './InstitutionFirestoreAdaptor';
import { oneDocumentP } from "../../utils/firestoreUtils";
import { CreateInstitutionDto, InstitutionInfo } from "./CreateInstitutionDto";
export const SCHOOLS = 'schools';
@Singleton()
export class InstitutionManagerAdapter {
  constructor() {}
  async createInstitution(createDto: CreateInstitutionDto) {
    const institution = await adminDb.collection(INSTITUTIONS).add(createDto);
    const institutiondocument = await oneDocumentP<InstitutionInfo>(adminDb.collection(INSTITUTIONS).doc(institution.id).get());  
    return institutiondocument;    
  }

  
  async updateInstitutionType (institutionId: string, institutionType: string){
    await adminDb.collection(INSTITUTIONS).doc(institutionId).set({
        "institutionType": institutionType
    },
    {merge: true});   
    return await oneDocumentP<any> (adminDb.collection(INSTITUTIONS).doc(institutionId).get());
    }
}