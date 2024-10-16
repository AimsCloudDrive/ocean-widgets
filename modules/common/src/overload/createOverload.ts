import { JSType } from "../types";
import { Collection } from "../collection";
import { defineProperty } from "../global";
import { assert } from "../assert";

const TYPE_SPLITOR = ",";
const lOAD_COLLECTION_KEY = Symbol("loadKey");
const ADD_IMPLEMENT = "addImplement" as const;

type OverLoadableFunction<
  Load extends JSType[][],
  TReturn extends any = void
> = ((...args: Load[number]) => TReturn) & {
  [ADD_IMPLEMENT]: <T extends Load[number]>(
    ...args: [...T, (...args: T) => TReturn]
  ) => void;
};
export function createOverload<
  Load extends JSType[][],
  TReturn extends any = void
>(): OverLoadableFunction<Load, TReturn> {
  const loadCollection: Collection<(...args: Load[number]) => TReturn> =
    new Collection((m) => {
      // 从方法上取参数列表key
      return Reflect.get(m, lOAD_COLLECTION_KEY);
    });
  const _Method = {
    method(...args: Load[number]): TReturn {
      const typeKey = args.map((v) => typeof v).join(TYPE_SPLITOR);
      const load = loadCollection.get(typeKey);
      assert(load, "No implementation found");
      return load.apply(this, args);
    },
    add<T extends Load[number]>(...args: [...T, (...args: T) => TReturn]) {
      const _m = args.pop();
      if (typeof _m !== "function") {
        throw Error("the last parameter must be function");
      }
      const _collectionKey = args.join(TYPE_SPLITOR);
      // 将参数列表key存在方法上
      defineProperty(_m, lOAD_COLLECTION_KEY, 0, _collectionKey);
      loadCollection.add(_m as (...args: Load[number]) => TReturn, true);
    },
  };
  defineProperty<any, typeof ADD_IMPLEMENT>(
    _Method.method,
    ADD_IMPLEMENT,
    0,
    _Method.add
  );
  return _Method.method as OverLoadableFunction<Load, TReturn>;
}
