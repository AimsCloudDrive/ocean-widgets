import {
  defineAccesser,
  defineProperty,
  getGlobalData,
  setGlobalData,
} from "@ocean/common";
import { Observer, ObserverOption } from "../Observer";

export function initComponentObservers(
  ctor: any
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

export function observer<T = any>(
  option?: ObserverOption<T>
): PropertyDecorator {
  const ob: Observer<T> = new Observer(option);
  return (ctor, propKey) => {
    const observers = initComponentObservers(ctor);
    observers[propKey] = ob;
    defineAccesser(ctor, propKey, 5, ob.get.bind(ob), ob.set.bind(ob));
  };
}
