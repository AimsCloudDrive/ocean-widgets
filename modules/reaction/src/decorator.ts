import { Observer } from "./Observer";

export function observer(): PropertyDecorator {
  const ob = new Observer();
  return (ctor: any, name: string | symbol) => {
    Object.defineProperty(ctor, name, {
      get: ob.get,
      set: ob.set,
    });
  };
}
