import {
  COMPONENT_OPTION_KEY,
  JSTypes,
  defineProperty,
  getGlobalData,
} from "@ocean/common";

export function initComponentOptions(ctor: any): any {
  let OPTIONS = Reflect.get(ctor, COMPONENT_OPTION_KEY);
  if (!OPTIONS) {
    OPTIONS = Object.create({});
    defineProperty(ctor, COMPONENT_OPTION_KEY, 0, OPTIONS);
  }
  return OPTIONS;
}

export function option(type?: JSTypes): PropertyDecorator {
  return (ctor: any, name: string | symbol) => {
    // TODO 必须在component中才能使用@option
    // const { componentKeyWord } = getGlobalData("@ocean/component");
    // const isComp = ctor[componentKeyWord];
    // if (!isComp) {
    //   console.error(`the decorator of 'option' should in a component`);
    //   return;
    // }
    const OPTIONS = initComponentOptions(ctor);
    OPTIONS[name] = {
      name,
      type,
    };
  };
}

type ComponentOption = {
  events: {
    [K in string]: JSTypes;
  };
};

export function component(
  name: string,
  option?: ComponentOption
): ClassDecorator {
  const { componentKeyMap, componentKeyWord, componentEventsKey } =
    getGlobalData("@ocean/component");
  const isExist = componentKeyMap.has(name);
  if (isExist) throw Error(`Component '${name}' is already exist.`);
  return function (ctor: any, ...args: any[]) {
    defineProperty(ctor, componentKeyWord, 0, name);
    if (option?.events) {
      const bingdingEvents = Object.entries(option.events).reduce(
        (_bingdingEvents, [ek, type]) =>
          Object.assign(_bingdingEvents, { [ek]: { type, _on: undefined } }),
        {}
      );
      defineProperty(ctor, componentEventsKey, 0, bingdingEvents);
    }

    componentKeyMap.set(name, ctor);
  };
}
