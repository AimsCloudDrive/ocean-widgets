import {
  COMPONENT_OPTION_KEY,
  JSTypes,
  OptionDecoratorUsedError,
  defineProperty,
} from "@ocean/common";

export function initComponentOptions(
  ctor: Object
): Record<string | symbol, { name: string | symbol; type: JSTypes }> {
  let OPTIONS = Reflect.get(ctor, COMPONENT_OPTION_KEY);
  if (!OPTIONS) {
    OPTIONS = Object.create({});
    defineProperty(ctor, COMPONENT_OPTION_KEY, 0, OPTIONS);
  }
  return OPTIONS;
}

/**
 * 仅允许附着在实例属性或实例访问器属性（有setter）
 * @param type
 * @returns
 */
export function option(type: JSTypes = "unknown"): PropertyDecorator {
  return (
    ctor: Object | (new (...args: any[]) => any),
    propKey: string | symbol,
    descriptor?: PropertyDescriptor & { initializer: () => any }
  ) => {
    const ccp = (window as any).optionds || [];
    (window as any).optionds = ccp;
    const oop = [ctor, propKey, { ...descriptor }];
    ccp.push(oop);
    try {
      if (typeof ctor === "function") {
        throw new OptionDecoratorUsedError();
      }
      if (descriptor) {
        if (
          !descriptor.set || // 没有setter
          typeof descriptor.value === "function" // 实例方法
        ) {
          throw new OptionDecoratorUsedError();
        }
      } else {
        if (!(ctor && propKey)) {
          // private || declare
          throw new OptionDecoratorUsedError();
        }
      }
      // TODO 必须在component中才能使用@option
      // const { componentKeyWord } = getGlobalData("@ocean/component");
      // const isComp = ctor[componentKeyWord];
      // if (!isComp) {
      //   console.error(`the decorator of 'option' should in a component`);
      //   return;
      // }
      const OPTIONS = initComponentOptions(ctor);
      OPTIONS[propKey] = {
        name: propKey,
        type,
      };
    } catch (e) {
      console.error(e);
    }
  };
}
