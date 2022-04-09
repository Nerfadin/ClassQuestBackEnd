// type fn = (...args: any) => any;
// function _arity(n: number, fn: fn) {
//   /* eslint-disable no-unused-vars */
//   switch (n) {
//     case 0:
//       return function (this: any) {
//         return fn.apply(this, arguments as any);
//       };
//     case 1:
//       return function (this: any, a0) {
//         return fn.apply(this, arguments as any);
//       };
//     case 2:
//       return function (this: any, a0, a1) {
//         return fn.apply(this, arguments as any);
//       };
//     case 3:
//       return function (this: any, a0, a1, a2) {
//         return fn.apply(this, arguments as any);
//       };
//     case 4:
//       return function (this: any, a0, a1, a2, a3) {
//         return fn.apply(this, arguments as any);
//       };
//     case 5:
//       return function (this: any, a0, a1, a2, a3, a4) {
//         return fn.apply(this, arguments as any);
//       };
//     case 6:
//       return function (this: any, a0, a1, a2, a3, a4, a5) {
//         return fn.apply(this, arguments as any);
//       };
//     case 7:
//       return function (this: any, a0, a1, a2, a3, a4, a5, a6) {
//         return fn.apply(this, arguments as any);
//       };
//     case 8:
//       return function (this: any, a0, a1, a2, a3, a4, a5, a6, a7) {
//         return fn.apply(this, arguments as any);
//       };
//     case 9:
//       return function (this: any, a0, a1, a2, a3, a4, a5, a6, a7, a8) {
//         return fn.apply(this, arguments as any);
//       };
//     case 10:
//       return function (this: any, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
//         return fn.apply(this, arguments as any);
//       };
//     default:
//       throw new Error(
//         "First argument to _arity must be a non-negative integer no greater than ten"
//       );
//   }
// }
// function _curryN(length: number, received: any, fn: fn) {
//   return function (this: any) {
//     var combined = <any>[];
//     var argsIdx = 0;
//     var left = length;
//     var combinedIdx = 0;
//     while (
//       combinedIdx < received.length ||
//       argsIdx < (arguments as any).length
//     ) {
//       var result;
//       if (
//         combinedIdx < received.length &&
//         (!_isPlaceholder(received[combinedIdx]) ||
//           argsIdx >= (arguments as any).length)
//       ) {
//         result = received[combinedIdx];
//       } else {
//         result = (arguments as any)[argsIdx];
//         argsIdx += 1;
//       }
//       combined[combinedIdx] = result;
//       if (!_isPlaceholder(result)) {
//         left -= 1;
//       }
//       combinedIdx += 1;
//     }
//     return left <= 0
//       ? fn.apply(this, combined)
//       : _arity(left, _curryN(length, combined, fn));
//   };
// }
// function _isPlaceholder(a) {
//   return (
//     a != null && typeof a === "object" && a["@@functional/placeholder"] === true
//   );
// }
// function _curry1(fn) {
//   return function f1(this: any, a) {
//     if ((arguments as any).length === 0 || _isPlaceholder(a)) {
//       return f1;
//     } else {
//       return fn.apply(this, arguments as any);
//     }
//   };
// }
// function _curry2(fn) {
//   return function f2(a, b) {
//     switch ((arguments as any).length) {
//       case 0:
//         return f2;
//       case 1:
//         return _isPlaceholder(a)
//           ? f2
//           : _curry1(function (this: any, _b) {
//               return fn(a, _b);
//             });
//       default:
//         return _isPlaceholder(a) && _isPlaceholder(b)
//           ? f2
//           : _isPlaceholder(a)
//           ? _curry1(function (this: any, _a) {
//               return fn(_a, b);
//             })
//           : _isPlaceholder(b)
//           ? _curry1(function (this: any, _b) {
//               return fn(a, _b);
//             })
//           : fn(a, b);
//     }
//   };
// }
// var curryN = _curry2(function curryN(length, fn) {
//   if (length === 1) {
//     return _curry1(fn);
//   }
//   return _arity(length, _curryN(length, [], fn));
// });
// export const curry = _curry1(function curry(fn) {
//   return curryN(fn.length, fn);
// });
//# sourceMappingURL=curry.js.map