"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ = exports.pipe = exports.curry = exports.immutalize = void 0;
const immer_1 = require("immer");
const { curry: curryRambda } = require("./curry");
// class Immutable {}
immer_1.enableAllPlugins();
/**
 * Returns an immutable version of the function passed
 *
 * All parameters passed through the new function are cloned
 *
 * @example
 * function lowercaseUsername (user: { name: string }) {
 *  user.name = user.name.toLowerCase()
 *  return user
 * }
 * const lowercaseUsernameI = immutable(lowercaseUsername)
 *
 * const user = {
 *  name: "Jason"
 * }
 * const lowercasedUser = lowercaseUsernameI(user);
 *
 * console.log(user == lowercasedUser) // false
 * console.log(user.name) // "Jason"
 * console.log(lowercasedUser.name) // "jason"
 */
exports.immutalize = (func) => {
    return (...args) => {
        const draftArray = immer_1.createDraft(args);
        const result = func(...draftArray);
        // result will be the return value (maybe draft)
        let res;
        if (immer_1.isDraftable(result)) {
            const resultDraft = immer_1.createDraft(result);
            res = immer_1.finishDraft(resultDraft);
        }
        else if (!result || typeof result !== "object") {
            res = result;
        }
        else {
            immer_1.createDraft(result); // will throw error
        }
        //clones result
        immer_1.finishDraft(draftArray);
        // trying to access properties in result will return null
        return res;
    };
};
/**
 * Curries a function and makes copies of all arguments passed to it
 *
 * Use __ as a placeholder
 *
 * @example
 * const getFullName = (name: string, lastName: string) => `${name} ${lastName}`
 * const getFullNameC = curry(getFullName)
 *
 * const fullNameTest1 = getFullNameC("Hello","World") // "Hello World"
 * const fullNameTest2 = getFullNameC("Hello")("World") // "Hello World"
 * const fullNameTest3 = getFullNameC(__, "Hello")("World") // "Hello World"
 *
 */
function curry(f) {
    return curryRambda(makeFunction(f.length, f.name, exports.immutalize(f)));
}
exports.curry = curry;
// const _pipe = (a, b) => (arg) => b(a(arg));
/**
 * Will pipe the return value of one function parameter of the next, immutalizing the parameters between each function
 *
 * @param operations Spread arary of pipes
 *
 * @example
 * const uppercase = (s: string) => s.toUpperCase()
 * const split = (split: string) => (s: string) => s.split(split)
 * const join = (separator: string) => (list: string[]) => list.join(separator)
 * const slugify = pipe(
 *    uppercase,
 *    split(" "),
 *    join("_"),
 * )
 * const slug = slugify("Hello World") // "HELLO_WORLD"
 */
exports.pipe = (...operations) => (v) => {
    return operations.reduce((res, func) => {
        // return immutalize(func)(res);
        return func(res);
    }, v);
};
/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 *
 * The following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */
exports.__ = { "@@functional/placeholder": true };
// declare const pipeAsync: F.Pipe<"async">;
// const aa = async (a1: number) => `${a1}`;
// const bb = async (b1: string) => [b1];
// const cc = async (c1: string[]) => c1;
// const res =  pipeAsync(aa, bb, cc)(42);
/**
 * Returns a function with n length and name
 *
 * @param length Length of the returned function
 * @param name Name of the function
 * @param fn Function to be transformed
 */
const makeFunction = function (length, name, fn) {
    const res = function (...args) {
        return fn.apply(this, args);
    };
    Object.defineProperty(res, "name", { value: name });
    Object.defineProperty(res, "length", { value: length });
    return res;
};
//# sourceMappingURL=immer.js.map