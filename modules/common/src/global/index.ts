const keys = new Map<string, symbol>();
export function setGlobalData(key: string, data: any) {
  let _key = keys.get(key);
  if (!_key) {
    keys.set(key, (_key = Symbol(key)));
  }
  Object.assign(globalThis, { [_key]: data });
}
export function getGlobalData(key: string) {
  let _key = keys.get(key);
  if (!_key) {
    setGlobalData(key, {});
    return getGlobalData(key);
  }
  return Reflect.get(globalThis, _key);
}

export type Nullable = null | undefined;

export type createFunction<T extends any[]> = T extends [...infer P, infer R]
  ? (...args: P) => R
  : never;

export const WRITABLE = 0x01;
export const ENUMERABLE = 0x02;
export const CONFIGURABLE = 0x04;

export function defineProperty<T extends any>(
  ctor: T,
  propKey: string | symbol,
  flag: number = 7,
  value?: any
) {
  Object.defineProperty(ctor, propKey, {
    value,
    writable: !!(WRITABLE & flag),
    enumerable: !!(ENUMERABLE & flag),
    configurable: !!(CONFIGURABLE & flag),
  });
}

export function defineAccesser<T extends any = any, R = any>(
  ctor: T,
  propKey: symbol | string,
  flag: number = 7,
  getter?: () => R,
  setter?: (value: any) => void
) {
  Object.defineProperty<T>(ctor, propKey, {
    writable: !!(WRITABLE & flag),
    enumerable: !!(ENUMERABLE & flag),
    configurable: !!(CONFIGURABLE & flag),
    get: getter,
    set: setter,
  });
}
