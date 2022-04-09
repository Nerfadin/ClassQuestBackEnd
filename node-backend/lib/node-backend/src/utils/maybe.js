"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = void 0;
const Either_1 = require("purify-ts/Either");
const Future_1 = require("./Future");
// interface Mappable<A> {
//   map<B>(f: (value: A) => B): Mappable<B>;
// }
// interface FlatMappable<T> {
//   flatten(f: (value: T) => FlatMappable<T>): FlatMappable<T>;
// }
// export function map<T>(f: (value: T) => T, mappable: Mappable<T>) {
//   return mappable.map(f);
// }
// export class Option<A> implements Mappable<A>, FlatMappable<A>{
//   private constructor(public value: A | null) {}
//   flatten(f: (value: A) => Option<A>): Option<A> {
//     if (this.value) {
//       const res = f(this.value);
//       if (res.value) {
//         return Some(res.value)
//       }
//       return None()
//     }
//     return None();
//   }
//   map<B>(f: (value: A) => B): Mappable<B> {
//     if (this.value) {
//       return Some(f(this.value));
//     }
//     return None();
//   }
//   // public map<B>(f: (_: A) => Option<B>): Option<B> {
//   //   return this.match({
//   //     Some: (x) => f(x),
//   //     None: () => Option.None<B>(),
//   //   });
//   // }
//   isSome() {
//     return this.value !== null;
//   }
//   isNone() {
//     return this.value === null;
//   }
//   public static Some<T>(a: T): Option<T> {
//     return new Option(a);
//   }
//   public static None<T = never>(): Option<T> {
//     return new Option<T>(null);
//   }
//   // public match<B, C>(cases: { Some: (a: A) => B; None: () => C }) : B | C{
//   //   if (this.value !== null) {
//   //     return cases.Some(this.value);
//   //   } else {
//   //     return cases.None();
//   //   }
//   // }
// }
// export function Some<T>(v: T) {
//   return Option.Some<T>(v);
// }
// export function None<T>() {
//   return Option.None<T>();
// }
// export type Result<S, F> = Success<S, F> | Failure<S, F>;
// export function isFailure<S, F>(f: Result<S, F>): f is Failure<S, F> {
//   return f.isFailure();
// }
// export function isSuccess<S, F>(s: Result<S, F>): s is Success<S, F> {
//   return s.isFailure();
// }
// export class Failure<S = any, F = any> implements Mappable<S> {
//   readonly error: F;
//   constructor(value: F) {
//     this.error = value;
//   }
//   map(f: (value: S) => S): Result<S, F> {
//     return failure(this.error);
//   }
//   isFailure(): this is Failure<S, F> {
//     return true;
//   }
//   isSuccess(): this is Success<S, F> {
//     return false;
//   }
//   match<TSucceed, TFail>(f: {
//     Failure: (e: F) => TFail;
//     Success: (v: S) => TSucceed;
//   }): TSucceed | TFail {
//     return f.Failure(this.error);
//   }
//   // onSuccess<B>(_: (a: S) => B): Result<B, F> {
//   //   return this as any;
//   // }
// }
// export class Success<S = any, F = any> implements Mappable<S> {
//   readonly value: S;
//   constructor(value: S) {
//     this.value = value;
//   }
//   map(f: (value: S) => S): Result<S, F> {
//     return success(f(this.value));
//   }
//   match<TSucceed, TFail>(f: {
//     Failure: (e: F) => TFail;
//     Success: (v: S) => TSucceed;
//   }): TSucceed | TFail {
//     return f.Success(this.value);
//   }
//   isFailure(): this is Failure<S, F> {
//     return false;
//   }
//   isSuccess(): this is Success<S, F> {
//     return true;
//   }
//   // onSuccess<B>(func: (a: S) => B): Result<B, F> {
//   //   return new $Success(func(this.value));
//   // }
// }
// export const failure = <S, F>(f: F): Result<S, F> => {
//   return new Failure<S, F>(f);
// };
// export const success = <S, F>(s: S): Result<S, F> => {
//   return new Success<S, F>(s);
// };
function tryCatch(promise, onError) {
    return Future_1.Future(promise
        .then((res) => {
        return Success(res);
    })
        .catch((err) => {
        return Failure(onError ? onError(err) : err);
    }));
    // try {
    //   const res = await s();
    // } catch (e) {
    //   return Failure<S, E>(onError ? onError(e) : e);
    // }
}
exports.tryCatch = tryCatch;
// type Result<S, F> = Either<F, S>;
const Success = (s) => Either_1.Right(s);
const Failure = (f) => Either_1.Left(f);
// type Option<T> = Maybe<T>;
// const Some = Just;
// const None = Nothing;
//# sourceMappingURL=maybe.js.map