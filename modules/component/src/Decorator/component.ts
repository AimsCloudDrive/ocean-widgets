import {
  ComponentDecoratorUsedError,
  JSTypes,
  defineProperty,
  getGlobalData,
} from "@ocean/common";

export type ComponentOption = {
  events?: {
    [K in string]: JSTypes;
  };
};

/**
 * 仅附着在类上
 * @param name
 * @param option
 * @returns
 */
export function component(
  name: string,
  option?: ComponentOption
): ClassDecorator {
  const { componentKeyMap, componentKeyWord, componentEventsKey } =
    getGlobalData("@ocean/component");
  const isExist = componentKeyMap.has(name);
  if (isExist) throw Error(`Component '${name}' is already exist.`);
  return function (ctor, ...args: any[]) {
    if (typeof ctor !== "function" || (args && args.length > 0)) {
      throw new ComponentDecoratorUsedError();
    }
    defineProperty(ctor.prototype, componentKeyWord, 0, name);
    if (option?.events) {
      // 绑定声明事件
      const bingdingEvents = Object.entries(option.events).reduce(
        (_bingdingEvents, [ek, type]) =>
          Object.assign(_bingdingEvents, { [ek]: { type, _on: undefined } }),
        {}
      );
      defineProperty(ctor.prototype, componentEventsKey, 0, bingdingEvents);
    }

    componentKeyMap.set(name, ctor);
  };
}
