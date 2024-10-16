export function setGlobalData(key: string, data: any) {
  Object.assign(globalThis, { [key]: data });
}
export function getGlobalData(key: string) {
  return Reflect.get(globalThis, key);
}

const writable = 0x01;
const enumerable = 0x02;
const configurable = 0x04;

export function defineProperty<T extends any, K extends symbol | keyof T>(
  ctor: T,
  propKey: K,
  flag: number = 7,
  value?: any
) {
  Object.defineProperty(ctor, propKey, {
    value,
    writable: !!(writable & flag),
    enumerable: !!(enumerable & flag),
    configurable: !!(configurable & flag),
  });
}

export function defineAccesser<T extends any = any, R = any>(
  ctor: T,
  propKey: symbol | keyof T,
  flag: number = 7,
  getter?: () => R,
  setter?: (value: any) => void
) {
  Object.defineProperty<T>(ctor, propKey, {
    writable: !!(writable & flag),
    enumerable: !!(enumerable & flag),
    configurable: !!(configurable & flag),
    get: getter,
    set: setter,
  });
}
