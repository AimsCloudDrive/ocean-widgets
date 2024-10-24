import { assert } from "../assert";
import { Collection } from "../collection";
import { defineProperty } from "../global";
import { ArgsType, JSTypes } from "../types";

const TYPE_SPLITOR = ",";
const OVERlOAD_KEY = Symbol("overload");
const ADD_IMPLEMENT = "addImplement" as const;

type OverLoadableFunction<
  Load extends JSTypes[][],
  TReturn extends any = void
> = ((...args: ArgsType<Load[number]>) => TReturn) & {
  [K in typeof ADD_IMPLEMENT]: <T extends Load[number]>(
    ...args: [...T, (...args: ArgsType<T>) => TReturn]
  ) => OverLoadableFunction<Load, TReturn>;
};
export function createOverload<
  Load extends JSTypes[][],
  TReturn extends any = void
>(_implements?: {
  [I in keyof Load]?: [...Load[I], (...args: ArgsType<Load[I]>) => TReturn];
}): OverLoadableFunction<Load, TReturn> {
  const overloadCollection: Collection<
    (...args: ArgsType<Load[number]>) => TReturn
  > = new Collection((m) => {
    // 从方法上取参数列表key
    return Reflect.get(m, OVERlOAD_KEY);
  });
  const Method = {
    method(...args: ArgsType<Load[number]>): TReturn {
      const overloadKey = args.map((v) => typeof v).join(TYPE_SPLITOR);
      const overload = overloadCollection.get(overloadKey);
      assert(overload, "Not implementation found");
      return overload.apply(this, args);
    },
    add<T extends Load[number]>(
      ...args: [...T, (...args: ArgsType<T>) => TReturn]
    ): void {
      const overload = args.pop();
      if (typeof overload !== "function") {
        throw Error("the last parameter must be function");
      }
      const overloadKey = args.join(TYPE_SPLITOR);
      const Overload = {
        overload(...args: ArgsType<T>) {
          return overload.apply(this, args);
        },
      };
      // 将参数列表key存在方法上
      defineProperty(Overload.overload, OVERlOAD_KEY, 0, overloadKey);
      overloadCollection.add(
        Overload.overload as (...args: ArgsType<Load[number]>) => TReturn,
        true
      );
    },
  };
  defineProperty(Method.method, ADD_IMPLEMENT, 0, Method.add);
  for (const v of _implements || []) {
    v && Method.add(...v);
  }
  return Method.method as OverLoadableFunction<Load, TReturn>;
}
