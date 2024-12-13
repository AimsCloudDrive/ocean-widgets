declare global {
  export namespace Ocean {
    export interface Store {}
  }
}

const keys = new Map<keyof Ocean.Store, symbol>();
export function setGlobalData<K extends keyof Ocean.Store>(
  key: K,
  data: Ocean.Store[K]
) {
  let _key = keys.get(key);
  if (!_key) {
    keys.set(key, (_key = Symbol(key)));
  }
  Object.assign(globalThis, { [_key]: data });
}
export function getGlobalData<K extends keyof Ocean.Store>(
  key: K
): Ocean.Store[K] {
  let _key = keys.get(key);
  if (!_key) {
    const data = {} as Ocean.Store[K];
    setGlobalData(key, data);
    return data;
  }
  return Reflect.get(globalThis, _key);
}

export type Nullable = null | undefined;

export type createFunction<T extends any[]> = T extends [...infer P, infer R]
  ? (...args: P) => R
  : never;

export const ENUMERABLE = 0x04;
export const WRITABLE = 0x02;
export const CONFIGURABLE = 0x01;

/**
 * @param ctor
 * @param propKey
 * @param flag 7
 * * const enumerable = 0x04;
 * * const writable = 0x02;
 * * const configurable = 0x01;
 * @param value
 */
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

/**
 * @param ctor
 * @param propKey
 * @param flag 7
 * * const enumerable = 0x04;
 * * const writable = 0x02;
 * * const configurable = 0x01;
 * * 访问器属性修饰符无法设置writable
 * @param getter
 * @param setter
 */
export function defineAccesser<T extends any = any, R = any>(
  ctor: T,
  propKey: symbol | string,
  flag: number = 5,
  getter?: () => R,
  setter?: (value: any) => void
) {
  Object.defineProperty<T>(ctor, propKey, {
    enumerable: !!(ENUMERABLE & flag),
    configurable: !!(CONFIGURABLE & flag),
    get: getter,
    set: setter,
  });
}

export const tryCall = <F extends (...args: any[]) => any>(
  call: F | undefined,
  data?: Parameters<F>,
  error?: (error: Error | unknown) => Error | unknown
): ReturnType<F> => {
  if (typeof call === "function") {
    try {
      return call(...(data || []));
    } catch (e: Error | unknown) {
      throw error ? error(e) : e;
    }
  }
  throw (error || "in OcPromise") + ` ${data}`;
};
