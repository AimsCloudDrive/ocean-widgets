import { defineProperty, WRITABLE, CONFIGURABLE, ENUMERABLE } from "../global";

export function autoBind(
  ctor: any,
  propKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const { get, set, value, writable, enumerable, configurable } = descriptor;
  if (get || set || !writable || typeof value !== "function") {
    return;
  }
  const flag =
    (enumerable ? ENUMERABLE : 0) |
    WRITABLE |
    (configurable ? CONFIGURABLE : 0);
  defineProperty(ctor, propKey, flag, value.bind(ctor));
}
