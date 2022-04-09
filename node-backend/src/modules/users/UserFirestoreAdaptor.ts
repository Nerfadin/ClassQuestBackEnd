import { adminDb } from "../../app";
import { firestore } from "firebase-admin";
import { CreateAccountToken } from "./CreateAccountToken";
import {
  oneDocumentP,
  UpdateFirestoreDocument,
} from "../../utils/firestoreUtils";
import { UnexpectedError } from "../../utils/errorUtils";
import { Player, PlayerStats } from "../../../../packages/interfaces/player";
import { Teacher } from "../../../../packages/interfaces/teacher";
import { Singleton, build } from "../../utils/tsyringe";
const USER_REGISTER_TOKEN = "user_register_token";
const PLAYERS = "players";
const PLAYER_STATS = "player_statistics";
const TEACHERS = "teachers";
@Singleton()
export class UserFirestoreAdaptor {
  createTeacher(dto: {
    id: string;
    email: string;
    nome: string;
    telefone: string;
  }) {
    return adminDb.collection(TEACHERS).doc(dto.id).set({
      email: dto.email,
      institutions: [],
      nome: dto.nome,
      telefone: dto.telefone,
    });
  }

  getPlayer(id: string) {
    return oneDocumentP<Player>(adminDb.collection(PLAYERS).doc(id).get());
  }

  getPlayerStats(id: string) {
    return oneDocumentP<PlayerStats>(
      adminDb.collection(PLAYER_STATS).doc(id).get()
    );
  }

  savePlayerStats(
    playerId: string,
    updateDto: UpdateFirestoreDocument<PlayerStats>
  ) {
    return adminDb
      .collection(PLAYER_STATS)
      .doc(playerId)
      .set(updateDto, { merge: true });
  }

  getTeacher(id: string) {
    return oneDocumentP<Teacher>(adminDb.collection(TEACHERS).doc(id).get());
  }

  savePlayer(id: string, player: UpdateFirestoreDocument<Player>) {
    return adminDb.collection(PLAYERS).doc(id).set(player, { merge: true });
  }

  createUserRegisterToken(email: string, institutionId: string) {
    const result = adminDb
      .collection(USER_REGISTER_TOKEN)
      .add({
        institutionId,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        return doc.id;
      });
    return result;
  }

  getUserRegisterToken(tokenId: string) {
    const token = oneDocumentP<CreateAccountToken>(
      adminDb.collection(USER_REGISTER_TOKEN).doc(tokenId).get()
    );
    return token;
  }

  deleteUserRegisterToken(tokenId: string) {
    const res = adminDb
      .collection(USER_REGISTER_TOKEN)
      .doc(tokenId)
      .delete()
      .catch((e) => {
        throw new UnexpectedError({
          message: "Error deleting token",
          details: e,
        });
      });
    return res;
  }

  updateTeacher(teacherId: string, update: UpdateFirestoreDocument<Teacher>) {
    return adminDb.collection(TEACHERS).doc(teacherId).update(update);
  }

  incrementTeacherValues(
    teacherId: string,
    values: Pick<
      Teacher,
      | "studentsCount"
      | "publishedActivitiesCount"
      | "studentsCompletedActivityCount"
      | "points"
    >
  ) {
    // TODO: (this) is not working because of circular DI
    return build(UserFirestoreAdaptor).updateTeacher(teacherId, {
      studentsCount: firestore.FieldValue.increment(values.studentsCount ?? 0),
      publishedActivitiesCount: firestore.FieldValue.increment(
        values.publishedActivitiesCount ?? 0
      ),
      studentsCompletedActivityCount: firestore.FieldValue.increment(
        values.studentsCompletedActivityCount ?? 0
      ),
      points: firestore.FieldValue.increment(values.points ?? 0),
    });
  }
}
