// import { Either, Right, Left } from "purify-ts/Either";
// // Future only throws if the underlying promise throws (shouldn't since its a Either promsie)
// // this future should map through 2 layers (PromiseLike and Either)
// // Cant return R (on await) and throw L because it implements PromiseLike<Either<L, R>> so must return Either<L, R>
// // union to intersection converter by @jcalz
// // Intersect<{ a: 1 } | { b: 2 }> = { a: 1 } & { b: 2 }
// // type Intersect<T> = (T extends any ? (x: T) => 0 : never) extends (
// //   x: infer R
// // ) => 0
// //   ? R
// //   : never;
// // // get keys of tuple
// // // TupleKeys<[string, string, string]> = 0 | 1 | 2
// // type TupleKeys<T extends any[]> = Exclude<keyof T, keyof []>;
// // // apply { foo: ... } to every type in tuple
// // // Foo<[1, 2]> = { 0: { foo: 1 }, 1: { foo: 2 } }
// // type Foo<T extends any[]> = {
// //   [K in TupleKeys<T>]: { foo: T[K] };
// // };
// // // get union of field types of an object (another answer by @jcalz again, I guess)
// // // Values<{ a: string, b: number }> = string | number
// // type Values<T> = T[keyof T];
// // TS won't believe the result will always have a field "foo"
// // so we have to check for it with a conditional first
// const isFutureSymbol = Symbol("isFuture");
// export function isFuture<L, R>(obj: any): obj is Future<L, R> {
//   return !!(obj as Future<L, R>)[isFutureSymbol];
// }
// export class FutureImpl<L, R> implements Future<L, R> {
//   constructor(private promise: PromiseLike<Either<L, R>>) {}
//   alwaysRight(): Future<never, void> {
//     return this.voidOnSuccess().chainLeft(() =>
//       Future<never, void>(Promise.resolve(Right(undefined)))
//     );
//   }
//   [isFutureSymbol]: boolean;
//   [Symbol.iterator]: () => Iterator<
//     Future<L, R>,
//     R,
//     { value?: R; returnSelf: boolean } | undefined
//   > = () => {
//     return {
//       next: (value?: { value?: R; returnSelf: boolean } | undefined) => {
//         if (value) {
//           // message by Future.run
//           if (value.returnSelf) {
//             return {
//               value: this,
//               done: false,
//             };
//           }
//           return {
//             value: value.value,
//             done: true,
//           };
//         }
//         return {
//           // message by function*(){}
//           done: false,
//           value: this,
//         };
//       },
//     } as Iterator<
//       Future<L, R>,
//       R,
//       { value?: R; returnSelf: boolean } | undefined
//     >;
//   };
//   static do<
//     R = any,
//     Ftr = Future<any, any>,
//     L = Ftr extends Future<infer L, any> ? L : never
//   >(
//     fun: () => Generator<Ftr, R, { value?: any; returnSelf: boolean }>
//   ): Future<L, R> {
//     const iterator = fun();
//     const firstVal = iterator.next({
//       returnSelf: true,
//     });
//     function run(lastValue: {
//       value: Future<any, any> | any;
//       done?: boolean;
//     }): any {
//       if (lastValue.done) {
//         return Right(lastValue.value);
//       }
//       return (lastValue.value as Future<any, any>).chain((val) => {
//         return run(
//           iterator.next({
//             returnSelf: false,
//             value: val,
//           })
//         );
//       });
//     }
//     return run(firstVal);
//   }
//   [isFutureSymbol] = true;
//   static fromEither<L = never, R = any>(either: Either<L, R>): Future<L, R> {
//     return new FutureImpl<L, R>(Promise.resolve(either));
//   }
//   static fromPromise<L = never, R = any>(
//     promise: PromiseLike<Either<L, R>>
//   ): Future<L, R> {
//     return new FutureImpl<L, R>(promise);
//   }
//   static of<L = never, R = any>(value: R | PromiseLike<R>) {
//     return new FutureImpl<L, R>(Promise.resolve(value).then((v) => Right(v)));
//   }
//   static fromPromises<L = never, R = any>(
//     promises: PromiseLike<Either<L, R>>[]
//   ): Future<L, R>[] {
//     return promises.map(Future.fromPromise);
//   }
//   static all<L = never, R = any>(futures: Future<L, R>[]): Future<L, R[]> {
//     return Future<L, R[]>(
//       (async () => {
//         const eithers = await Promise.all(futures);
//         return Either.sequence(eithers);
//       })()
//     );
//   }
//   where(condition: (value: R) => boolean, orElseErr: () => L): Future<L, R> {
//     return this.chain((val) => {
//       const isValid = condition(val);
//       if (isValid) return Right(val);
//       else return Left(orElseErr());
//     });
//   }
//   map<R2>(f: (value: R) => R2 | PromiseLike<R2>): Future<L, R2> {
//     return new FutureImpl<L, R2>(
//       this.promise.then(async (either) => {
//         if (either.isRight()) {
//           const res = await f(either.extract());
//           return Right(res);
//         }
//         return Left(either.extract() as L);
//       }) as PromiseLike<Either<L, R2>>
//     );
//   }
//   mapLeft<L2>(f: (value: L) => L2 | PromiseLike<L2>): Future<L2, R> {
//     return new FutureImpl<L2, R>(
//       this.promise.then(async (either) => {
//         if (either.isLeft()) {
//           const res = await f(either.extract());
//           return Left(res);
//         }
//         return Right(either.extract() as R);
//       }) as PromiseLike<Either<L2, R>>
//     );
//   }
//   chain<R2>(
//     f: (value: R) => PromiseLike<Either<L, R2>> | Either<L, R2> | Future<L, R2>
//   ): Future<L, R2> {
//     return new FutureImpl<L, R2>(
//       this.promise.then(async (either) => {
//         if (either.isRight()) {
//           const res = await f(either.extract());
//           return res;
//         }
//         return Left(either.extract() as L);
//       }) as PromiseLike<Either<L, R2>>
//     );
//   }
//   chainLeft<L2>(
//     f: (value: L) => PromiseLike<Either<L2, R>> | Either<L2, R> | Future<L2, R>
//   ): Future<L2, R> {
//     return new FutureImpl<L2, R>(
//       this.promise.then(async (either) => {
//         if (either.isLeft()) {
//           const res = await f(either.extract());
//           return res;
//         }
//         // return either as Either<never, R>;
//         return Right(either.extract() as R);
//       }) as PromiseLike<Either<L2, R>>
//     );
//   }
//   toPromise() {
//     return this.promise;
//   }
//   bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Future<L2, R2> {
//     return new FutureImpl<L2, R2>(
//       this.promise.then(async (either) => {
//         if (either.isRight()) {
//           const res = either.extract();
//           return Right(g(res));
//         }
//         const res = either.extract() as L;
//         return Left(f(res));
//       }) as PromiseLike<Either<L2, R2>>
//     );
//   }
//   caseOf<T>(patterns: FuturePatterns<L, R, T>): PromiseLike<T> {
//     return this.promise.then((val) => val.caseOf(patterns));
//     // const res = await this.promise;
//     // return res.caseOf(patterns);
//   }
//   join<R2>(
//     this: Future<L, Either<L, R2>> | Future<L, Future<L, R2>>
//   ): Future<L, R2> {
//     return (this as Future<L, Either<L, R2>>).chain((v) => v);
//   }
//   voidOnSuccess(): Future<L, void> {
//     return this.map(() => {});
//   }
//   swap(): Future<R, L> {
//     return new FutureImpl<R, L>(
//       (async () => {
//         const res = await this.promise;
//         return res.swap();
//       })()
//     );
//   }
//   // reason why .then doesnt map through Either:
//   // because if it did, when i awaited it, it would have to throw an error when Left failed, and I dont want it to throw errors
//   // the catch error is dynamic because this function does not throw error when the Either is Left
//   then<TResult1 = any, TResult2 = never>(
//     onfulfilled?: (value: Either<L, R>) => TResult1 | PromiseLike<TResult1>,
//     onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
//   ): PromiseLike<TResult1 | TResult2> {
//     return this.promise.then(onfulfilled, onrejected);
//   }
//   [isFutureSymbol] = true;
//   [Symbol.toStringTag]: "Future" = "Future";
// }
// // // this is a shit future, because it is only a promise with a typed error
// // // also it is not truly typed since it can return a error from a sub function, but ok for pure function
// // export class UnsafeFuture<L, R> implements PromiseLike<R> {
// //   constructor(private promise: PromiseLike<Either<L, R>>) {}
// //   then<TResult1 = R, TResult2 = L>(
// //     onfulfilled?: (value: R) => TResult1 | PromiseLike<TResult1>,
// //     onrejected?:
// //       | ((reason: any) => TResult2 | PromiseLike<TResult2>)
// //       | null
// //       | undefined
// //   ): PromiseLike<TResult1 | TResult2> {
// //     throw new Error("Method not implemented.");
// //   }
// //   catch<TResult = never>(
// //     onrejected?:
// //       | ((reason: any) => TResult | PromiseLike<TResult>)
// //       | null
// //       | undefined
// //   ): PromiseLike<R | TResult> {
// //     throw new Error("Method not implemented.");
// //   }
// //   [Symbol.toStringTag]: string;
// //   finally(onfinally?: (() => void) | null | undefined): PromiseLike<R> {
// //     throw new Error("Method not implemented.");
// //   }
// // }
// function isEither(obj: any): obj is Either<any, any> {
//   if (typeof obj === "object") {
//     if (obj["_"] === "R" || obj["_"] === "L") {
//       return true;
//     }
//   }
//   return false;
// }
// export declare type FuturePatterns<L, R, T> =
//   | {
//       Left: (l: L) => T;
//       Right: (r: R) => T;
//     }
//   | {
//       _: () => T;
//     };
// export interface Future<L, R> extends PromiseLike<Either<L, R>> {
//   toPromise(): PromiseLike<Either<L, R>>;
//   voidOnSuccess(): Future<L, void>;
//   alwaysRight(): Future<never, void>;
//   swap(): Future<R, L>;
//   where(condition: (value: R) => boolean, orElseLeft: () => L): Future<L, R>;
//   map<R2>(f: (value: R) => R2): Future<L, R2>;
//   map<R2>(f: (value: R) => PromiseLike<R2>): Future<L, R2>;
//   mapLeft<L2>(f: (value: L) => L2): Future<L2, R>;
//   mapLeft<L2>(f: (value: L) => PromiseLike<L2>): Future<L2, R>;
//   join<R2>(
//     this: Future<L, Either<L, R2>> | Future<L, Future<L, R2>>
//   ): Future<L, R2>;
//   bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Future<L2, R2>;
//   caseOf<T>(patterns: FuturePatterns<L, R, T>): PromiseLike<T>;
//   chain<R2, L2>(f: (value: R) => Either<L2, R2>): Future<L | L2, R2>;
//   chain<R2, L2>(f: (value: R) => PromiseLike<Either<L, R2>>): Future<L, R2>;
//   chain<R2, L2>(f: (value: R) => Future<L2, R2>): Future<L | L2, R2>;
//   chainLeft<L2>(f: (value: L) => Either<L2, R>): Future<L2, R>;
//   chainLeft<L2>(f: (value: L) => PromiseLike<Either<L2, R>>): Future<L2, R>;
//   chainLeft<L2>(f: (value: L) => Future<L2, R>): Future<L2, R>;
//   then: PromiseLike<Either<L, R>>["then"];
//   [Symbol.toStringTag]: "Future";
//   [isFutureSymbol]: boolean;
//   [Symbol.iterator]: () => Iterator<
//     Future<L, R>,
//     R,
//     { value?: R; returnSelf: boolean } | undefined
//   >;
// }
// interface FutureConstructor {
//   <L = Error, R = void>(): Future<L, R>;
//   <L = Error, R = any>(val: PromiseLike<Either<L, R>>): Future<L, R>;
//   <L = Error, R = any>(val: PromiseLike<R>): Future<L, R>;
//   <L = Error, R = any>(val: Either<L, R>): Future<L, R>;
//   <L = Error, R = any>(val: R): Future<L, R>;
// }
// export const Future = Object.assign(
//   (<L = Error, R = any>(val?: any) => {
//     return new FutureImpl<L, R>(
//       (async () => {
//         const value = await Promise.resolve(val as PromiseLike<Either<L, R>>);
//         if (isEither(value)) {
//           return value;
//         }
//         return Right(value);
//       })()
//     ) as Future<L, R>;
//   }) as FutureConstructor,
//   {
//     do: FutureImpl.do,
//     fromEither: FutureImpl.fromEither,
//     fromPromise: FutureImpl.fromPromise,
//     of: FutureImpl.of,
//     fromPromises: FutureImpl.fromPromises,
//     all: FutureImpl.all,
//   }
// );
// // type Chainable<T> = {
// //   chain<T2>(f: (value: T) => Chainable<T2>): Chainable<T2>;
// // };
// // type Mappable<T> = {
// //   map<T2>(f: (value: T) => T2): Mappable<T2>;
// // };
// // type getChainableValue<T> = T extends Chainable<infer U> ? U : never;
// // type getMappableValue<T> = T extends Mappable<infer U> ? U : never;
// // const chain = <
// //   InitialMonad extends Chainable<T> = Chainable<any>,
// //   FinalMonad extends Chainable<T2> = Chainable<any>,
// //   T = getChainableValue<InitialMonad>,
// //   T2 = getChainableValue<FinalMonad>
// // >(
// //   monad: InitialMonad,
// //   chainer: (value: T) => FinalMonad
// // ) => {
// //   return monad.chain(chainer) as FinalMonad;
// // };
// // const map = <
// //   T2,
// //   InitialFunctor extends Mappable<T> = Mappable<any>,
// //   T = getMappableValue<InitialFunctor>,
// //   FinalFunctor extends Mappable<T2> = Mappable<T2>
// // >(
// //   monad: InitialFunctor,
// //   mapper: (value: T) => T2
// // ) => {
// //   return monad.map(mapper) as FinalFunctor;
// // };
// // const s = map(Future(0), (val) => val.toString());
// // const v = chain(Future(0), (val) => Right(val + 1)); // should return type Future
// // type getProperty<T, P extends keyof T> = T[P];
// // type getFirstParam<T extends (param: any) => any> = T extends (
// //   param: infer U
// // ) => any
// //   ? U extends (arg: infer A) => infer B
// //     ? (value: A) => B
// //     : never
// //   : never;
// // type cchain = getFirstParam<getProperty<Either<Error, string>, "map">>;
// // type Map<T extends { map: (arg: any) => any }> = getProperty<T, "map">;
// // type Chain<T extends { chain: (arg: any) => any }> = getProperty<T, "chain">;
// // const map = <T extends { map: (arg: any) => any }>(
// //   functor: T,
// //   mapper: Parameters<Map<T>>[0]
// // ): ReturnType<Map<T>> => {
// //   return functor.map(mapper);
// // };
// // const chain = <T extends { chain: (arg: any) => any }>(
// //   monad: T,
// //   chainer: getFirstParam<Chain<T>>
// // ): ReturnType<Chain<T>> => {
// //   return monad.chain(chainer);
// // };
// // const v = map(Future(0), async (m) => m.toString()); //should be Future<never, string>
// // const c = chain(Future(0), (num) => Future(num + 1));
// // type UnwrapChainable<T> = T extends Chainable<infer U> ? U : T;
// // type DoUnwrapChainable<T> = {
// //   [P in keyof T]: T[P] extends (...args: any[]) => infer U
// //     ? UnwrapChainable<U>
// //     : UnwrapChainable<T[P]>;
// // };
// // function Do<
// //   Thiss extends { [P in keyof Thiss]: Function } = {},
// //   T = {
// //     [P in keyof Thiss]: (self: Omit<DoUnwrapChainable<Thiss>, P>) => any;
// //   },
// //   R = any
// // >(operations: Thiss) {
// //   return {
// //     // Return(f: (result: DoUnwrapChainable<T>) => R) {
// //     //   return f(operations as any);
// //     // },
// //   };
// // }
// // Do({
// //   age: () => Right(17),
// //   user(self) {
// //     return Right({
// //       name: "Jason",
// //       sla: this.age.toLocaleString(),
// //     });
// //   },
// // });
// // function chain<T>(monad: Chainable<T>): T {
// //   return 0 as any;
// // }
// // function For<T>(action: () => T): Chainable<T> {
// //   return 0 as any;
// // }
// // function getPostsByUser(user: User): Future<never, { comment: string }[]> {
// //   return Future([]);
// // }
// // function main23() {
// //   const res = For(() => {
// //     const user = chain(
// //       Future<never, User>({ name: "jason" })
// //     );
// //     const posts = chain(getPostsByUser(user));
// //     return posts;
// //   });
// // }
// // .Return((res) => {
// //   return res.user;
// // });
// // type User = {
// //   name: string;
// // };
// // type Comment = {
// //   comment: string;
// // };
// // async function main() {
// //   // const profile = Future<Error, User>({ name: "Jason" });
// //   const profile = Future<Error, User>(Left(new Error("No user :/")));
// //   const lowercaseUsername = (user: User) =>
// //     Future<Error, User>({
// //       ...user,
// //       name: user.name.toLowerCase(),
// //     });
// //   const getComments = (user: User) =>
// //     Future<Error, Comment[]>([{ comment: "hi " + user.name }]);
// //   const profileWithComments = profile
// //     .bimap((e) => new Error("No profile!"), lowercaseUsername)
// //     .join()
// //     // .chain(lowercaseUsername)
// //     // .chainLeft((e) => Left(new Error("Error getting profile")))
// //     .chain((user) => {
// //       return getComments(user).chain((comments) => Right({ user, comments }));
// //     });
// //   profileWithComments.caseOf({
// //     Right: console.log,
// //     Left: console.log,
// //   });
// // }
// // // Left Identity
// // const valueL = 1;
// // const optionL = Future(valueL);
// // const fL = (x: number) => Future(x * 2);
// // const resLeft = optionL.chain(fL) == fL(valueL);
// // // Right Identity
// // const optionR = Future(1);
// // const resR = optionR.chain((e) => Right(e)) == optionR;
// // // Associativity
// // const optionA = Future(1);
// // const f = (x: number) => Future(x * 2);
// // const g = (x: number) => Future(x + 6);
// // const resA =
// //   optionA.chain(f).chain(g) == optionA.chain((val) => f(val).chain(g));
// // console.log(">tfw no gf implying hello world");
// // function getGroup(groupId: string) {
// //   console.log("got group from db");
// //   return Future({ name: "group1", players: ["student1"] });
// // }
// // function addStudentToGroupDb(studentId: string, groupId: string) {
// //   console.log("addind student to group in db");
// //   return Future("done");
// //   // return Future(Left(new Error("Database error !")));
// // }
// // function incrementTeachersScore(teacherId: string, incr: any) {
// //   console.log("increment t score");
// //   return Future("done");
// //   // return Future(Left(new Error("failed increment t score :(")));
// // }
// // function addStudentToGroup(
// //   studentId: string,
// //   groupId: string,
// //   teacherId: string
// // ) {
// //   return Future.for(function* () {
// //     const group = yield* getGroup(groupId);
// //     if (group.players.includes(studentId)) {
// //       yield* Future(Left(new Error("Already in group")));
// //     }
// //     yield* addStudentToGroupDb(studentId, groupId);
// //     console.log("added student ", studentId, "to group", groupId);
// //     yield* incrementTeachersScore(teacherId, {});
// //     console.log("incremented to teacher ", teacherId);
// //     return group;
// //     // if (group.players.includes(studentId)) {
// //     //   yield* Future(Left(new Error("User already in group")));
// //     // }
// //   });
// // }
// // async function test() {
// //   const res = addStudentToGroup("student2", "group1", "teacher1");
// //   res.caseOf({
// //     Right: (res) => console.log("@@@@@done: ", res),
// //     Left: (err) => console.log("@@@@@err: ", err.message)
// //   });
// // }
// // test();
// // async function main() {
// //   const v = Future.for(function* () {
// //     const group = getGroup("1");
// //     // const name = yield* Future("jason");
// //     yield* addStudentToGroupDb("1", "2");
// //     // const age = yield* Future(10);
// //     // const age = yield* Future(Left<Error, number>(new Error("not 10!!")));
// //     yield* incrementTeachersScore("1", {});
// //     console.log("all good =)");
// //     // const favAnimal = yield* Future("rawr");
// //     // return name;
// //     return {
// //       group
// //       // age,
// //       // favAnimal
// //     };
// //   });
// //   const res = await v;
// //   console.log(typeof res);
// //   res.caseOf({
// //     Right: (profile) => console.log(profile),
// //     Left: (err) => console.log(err)
// //   });
// // }
// // main();
// // const v = Future.for(function* () {
// //   //: Future<ApiError | string, number>
// //   const b = yield* Future<ApiError, number>(10);
// //   const a = yield* Future<string, number>(9);
// //   return a + b;
// // });
// // //TODO:make v a Future<ApiError | string, number> instead of Future<ApiError, number> | Future<string, number>
// // type Map = {
// //   <T, T2, L>(mapper: (val: T) => T2): (m: Future<L, T>) => Future<L, T2>;
// //   <T, T2, L>(mapper: (val: T) => T2): (m: Either<L, T>) => Either<L, T2>;
// //   <T, T2>(mapper: (val: T) => T2): (m: Maybe<T>) => Maybe<T2>;
// //   <T, T2>(mapper: (val: T) => T2): (m: Mappable<T>) => Mappable<T2>;
// // };
// // type MapLeft = {
// //   <T, T2, R>(mapper: (val: T) => T2): (m: Future<T, R>) => Future<T2, R>;
// //   <T, T2, R>(mapper: (val: T) => T2): (m: Either<T, R>) => Either<T2, R>;
// // };
// // export const mapLeft: MapLeft = (mapper) => (m) => {
// //   return m.mapLeft(mapper);
// // };
// // export const map: Map = (mapper) => (m) => {
// //   return m.map(mapper);
// // };
// // const identity = <T>(val: T) => val;
// // const k = <T>(val: T) => () => val;
// // const hi = pipe(
// //   (msg: Future<Error, number>) => msg,
// //   map((h) => h + 1),
// //   identity,
// //   k(0),
// //   (zero) => Future(zero),
// //   map((fZero) => fZero * 10)
// // );
// // const reee = hi(Future(0));
// // const userId = (id: string) => id as UserId;
// // class UserId {}
// // class Email {}
// // const userEmail = (email: string) => Future<Error, Email>(email);
// // type input = {
// //   id: string;
// //   email: string;
// // };
// // const user = (input: input) =>
// //   Future.do(function* () {
// //     const id = userId(input.id);
// //     const email = yield* userEmail(input.email);
// //     return {
// //       id,
// //       email,
// //       __typename: "IAM_User_User",
// //     };
// //   });
//# sourceMappingURL=Future.js.map