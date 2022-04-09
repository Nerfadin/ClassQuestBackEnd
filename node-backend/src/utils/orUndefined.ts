export function orUndefined<T>(p: Promise<T>) {
  return p.catch((_err) => undefined);
}
