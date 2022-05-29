import { createUserWithEmailAndPassword } from 'firebase-auth';
import { adminDb } from '../../app';
import { RegisterTeacherDto } from './models/RegisterDto';

export class CreateAccountAdapter {
    async registerTeacher(teacher: RegisterTeacherDto, institutionId: string) {
        await createUserWithEmailAndPassword(teacher.email, teacher.password).then(async (user) => {
            await adminDb.collection("teachers").doc(user.uid).set({
                email: teacher.email,
                nome: teacher.nome,
                institutions: [],
            });
        });
    }
}