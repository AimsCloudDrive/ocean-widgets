import {
  ObserverDecoratorUsedError,
  defineAccesser,
  defineProperty,
  getGlobalData,
  setGlobalData,
} from "@ocean/common";
import { Observer, ObserverOption } from "../Observer";

export function initComponentObservers(
  ctor: Object
): Record<string | symbol, Observer<any>> {
  let { observerListKey } = getGlobalData("@ocean/reaction");
  if (!observerListKey) {
    observerListKey = Symbol("observerListKey");
    setGlobalData("@ocean/reaction", {
      observerListKey,
    });
  }
  const observers = ctor[observerListKey] || {};
  defineProperty(ctor, observerListKey, 0, observers);
  return observers;
}

/**
 * 仅允许附着在实例属性上
 * @param option
 * @returns
 */
export function observer<T = any>(option?: ObserverOption<T>) {
  const ob: Observer<T> = new Observer(option);
  return (
    ctor: Object | Function,
    propKey: string | symbol,
    descriptor?: PropertyDescriptor & { initializer: () => T }
  ) => {
    // observer仅用在实例属性上
    const ccp = (window as any).observers || [];
    (window as any).observers = ccp;
    const oop = [ctor, propKey, { ...descriptor }];
    ccp.push(oop);
    try {
      if (typeof ctor === "function") {
        // 构造函数 静态或类
        throw new ObserverDecoratorUsedError();
      }
      if (descriptor) {
        if (
          descriptor.get || // 计算属性
          descriptor.set ||
          typeof descriptor.value === "function" // 实例方法
        ) {
          throw new ObserverDecoratorUsedError();
        }
        if (descriptor.initializer) {
          const value = descriptor.initializer();
          ob.set(value);
        }
        Object.keys(descriptor).forEach((key) => {
          delete descriptor[key];
        });
        Object.assign(descriptor, {
          get() {
            return ob.get();
          },
          set(value: T) {
            ob.set(value);
          },
          enumerable: false,
          configurable: true,
        });
      } else {
        if (!(ctor && propKey)) {
          throw new ObserverDecoratorUsedError();
        }
        // private || declare
        defineAccesser(
          ctor,
          propKey,
          1,
          () => ob.get(),
          (value: T) => ob.set(value)
        );
      }
      // 初始化组件的observers
      const observers = initComponentObservers(ctor);
      observers[propKey] = ob;
    } catch (e) {
      console.error(e);
    }
  };
}
