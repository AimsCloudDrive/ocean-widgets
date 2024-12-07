import { defineAccesser } from "@ocean/common";
import { Observer } from "../Observer";

export function observer<T = any>(init?: T): PropertyDecorator {
  const ob = new Observer<T>(init);
  return (ctor: any, name: string | symbol) => {
    defineAccesser(ctor, name, 5, ob.get, ob.set);
  };
}
