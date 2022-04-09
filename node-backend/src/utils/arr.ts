  export function includesAny<T>(arr: T[], includesAny: T[]) {
    return arr.some((r) => includesAny.includes(r));
  }
  export function includesAll<T>(arr: T[], includesAny: T[]) {
    return arr.every((r) => includesAny.includes(r));
  }
