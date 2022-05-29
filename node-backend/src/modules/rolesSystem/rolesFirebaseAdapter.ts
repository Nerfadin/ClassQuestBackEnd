import {adminDb} from '../../app';
import { manyDocumentsOrErrorP } from '../../utils/firestoreUtils';

export function f (){
    return  manyDocumentsOrErrorP <any>(adminDb.collection('teachers').get());
}