import { firestore } from "firebase-admin";
import { EntityNotFoundError, UnexpectedError } from "./errorUtils";
import { DeepPartial } from "./typeUtils";

export type Or<T, U> = {
  [P in keyof (T | U)]: T[P] | U[P];
};
export type AddFieldValuesTo<T> = Or<
  T,
  {
    [P in keyof T]: firestore.FieldValue;
  }
>;
export type UpdateFirestoreDocument<T> = DeepPartial<AddFieldValuesTo<T>>;

export async function oneDocumentP<T>(
  promise: Promise<firestore.DocumentSnapshot>
) {
  return promise
    .then((doc) => {
      if (doc.exists) {
        return ({
          ...doc.data(),
          id: doc.id,
        } as any) as T;
      }
      throw new EntityNotFoundError();
    })
    .catch((e) => {
      throw e instanceof EntityNotFoundError
        ? e
        : new UnexpectedError({ details: e });
    });
}

export function manyDocuments<T>(query: firestore.QuerySnapshot): T[] {
  return query.docs.map(
    (doc) =>
      (({
        ...doc.data(),
        id: doc.id,
      } as any) as T)
  );
}

export async function manyDocumentsOrErrorP<T>(
  promise: Promise<firestore.QuerySnapshot>
) {
  try {
    const query = await promise;
    return query.docs.map(
      (doc) =>
        (({
          ...doc.data(),
          id: doc.id,
        } as any) as T)
    );
  } catch (e) {
    throw new UnexpectedError({ details: e });
  }
}