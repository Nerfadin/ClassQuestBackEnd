import {adminDb } from '../../../app';
import {Singleton}from '../../../utils/tsyringe';
@Singleton()
export class OwnerFirebaseAdapter {

async getOwnerInstitutions(ownerId: string){
return adminDb.collection("institutions").where("ownedBy", "==", ownerId).get();    
}
    
}