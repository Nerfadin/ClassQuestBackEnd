import functions from "firebase-functions";
import { NextFunction, Request, Response } from "express";
import { adminAuth } from "../app";
import { AuthorizationError } from "../utils/errorUtils";
import firebaseAdmin from "firebase-admin";
import { isNotEmpty } from "class-validator";
import { serializeError } from "serialize-error";
declare global {
  namespace Express {
    interface Request {
      user: firebaseAdmin.auth.DecodedIdToken;
    }
  }
}

export async function recoverPassword(email: string){
   adminAuth.generatePasswordResetLink(email);
  
  }
export function checkDeviceId(){
  return async (req: Request, res: Response, next: NextFunction) => {
    const savedId = req.headers.clouddeviceid;
    const currentId = req.headers.localdeviceid;
    
    if ( savedId == null || currentId == null || currentId != savedId ) {
    next(
      new AuthorizationError({
        message: "wrong device Id",
        type: "wrong_device_id",
      })
    );
    return;
  }else {
    console.log("inside else");
    next();
  } 
}
}
export function verifyAuthenticated() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      next(
        new AuthorizationError({
          message: "No user token",
          type: "missing_user_token",
        })
      );
      console.log("Im here")
      return;
    }
    try {
      const valid = await adminAuth.verifyIdToken(token);
      req.user = valid;
      next();
    } catch (e) {
      if (e.code === "auth/id-token-expired") {
        next(
          new AuthorizationError({
            message: "Token expired",
            details: e,
            type: "token_expired",
          })
        );
      } else
        next(
          new AuthorizationError({
            message: "Invalid user token",
            details: e,
            type: "invalid_user_token",
          })
        );
    }
  };
}
export const reportFailureFunctions = <T>(resultP: Promise<T>) =>
  resultP.catch(functions.logger.log);

/// DESCULPA, ESSA FUNÇÃO ESTÁ RUIM PQ EU TINHA PERDIDO ELA NO .gitignore E RECUPEREI SÓ
// O JAVASCRIPT COMPILADO, ENTÃO DEVE ESTAR HORRIVEL DE LER
function replaceFirestore(value, prop) {
  const obj = value;
  if (obj instanceof firebaseAdmin.firestore.DocumentReference) {
    // this[prop + "Id"] = obj.id;
    return undefined;
  }
  if (obj instanceof firebaseAdmin.firestore.WriteResult) {
    return {
      writeTime: obj.writeTime.toDate(),
    };
  }
  if (obj instanceof firebaseAdmin.firestore.Timestamp) {
    return obj.toDate();
  }
  for (const prop in obj) {
    if (obj[prop]) {
      if (typeof obj[prop] === "object") {
        obj[prop] = replaceFirestore.call(value, obj[prop], prop);
      }
      if (Array.isArray(obj[prop])) {
        obj[prop] = obj[prop].map((o) => replaceFirestore.call(value, o));
      }
    }
  }
  return obj;
}
// const firebaseExtractor = function (key, val) {
//   const firestore = val["_firestore"] || val["firestore"];
//   if (typeof val == "object" && firestore) {
//     this[key + "Id"] = val["id"];
//     return undefined;
//   } else return val;
// };
export function returnFailureOrSuccessExpress(
  resultF: (
    req: Request,
    user: firebaseAdmin.auth.DecodedIdToken
  ) => Promise<any>,
  removeFirebase = true
) {
  return (req, res, next) =>
    resultF(req, req.user)
      .then((result) => {
        res.send(
          isNotEmpty(result)
            ? {
                data: removeFirebase
                  ? replaceFirestore.call({}, result)
                  : result,
              }
            : {}
        );
      })
      .catch((err) => {
        next(err);
      });
}
export const expressErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    error: serializeError(err),
  });
};