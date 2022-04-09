import { injectable, inject, delay, singleton, container } from "tsyringe";
export const Injectable = injectable;
export const Singleton = singleton;
// export const Inject = inject;
export const Inject = <T>(f: () => constructor<T>) => inject(delay(f));
export const build = <T>(Class: constructor<T>) => container.resolve(Class);

type constructor<T> = {
  new (...args: any[]): T;
};
