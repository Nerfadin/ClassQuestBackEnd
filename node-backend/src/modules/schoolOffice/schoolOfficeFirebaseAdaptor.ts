import { adminDb } from "src/app";
//import { manyDocumentsOrErrorP } from "../../utils/firestoreUtils";

export const OWNER_HAS_TEACHER = "owner_has_teacher";
export const INSTITUTION_HAS_OWNER = "owner_has_institution";

export class SchoolOfficeFirebaseAdaptor {

    async getUserOwners(){
        
    }
    async isTeacherOwned(teacherId: string, ownerId: string){                
        const snapshop = await adminDb.collection(OWNER_HAS_TEACHER).where("owner", "==", ownerId).where("teacher", "==", teacherId).get();
            snapshop.empty ? false : true;            
    }
    async createOwnership(teacherId: string, ownerId: string){        
        const ownershipRelation = await adminDb.collection(OWNER_HAS_TEACHER).add({
            teacher: teacherId,
            owner: ownerId
        })
        return ownershipRelation;

    }
    async deleteTeacherOwnership(teacherId: string, ownerId: string) 
    {
        const snapshop = await adminDb.collection(OWNER_HAS_TEACHER).where("owner", "==", ownerId).where("teacher", "==", teacherId).get();
     // const relations = manyDocumentsOrErrorP<T>(snapshop);
        snapshop.docs.map(async (doc) =>{
            await adminDb.collection(OWNER_HAS_TEACHER).doc(doc.id).delete();
        })
      
        
    }

}