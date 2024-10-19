import { defineProperty } from "../global";

export function init<T>(initial: T) {
  return function (ctor: any, propKey: symbol | string) {
    if (typeof propKey == "number") {
      return;
    }
    defineProperty(ctor, propKey, 7, initial);
  };
}
