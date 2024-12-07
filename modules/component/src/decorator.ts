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
    const { componentKeyWord } = getGlobalData("@ocean/component");
    const isComp = ctor[componentKeyWord];
    if (isComp) {
      console.error(`the decorator of 'option' should in a component`);
      return;
    }
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

export function component(name: string, option?: ComponentOption) {
  const { componentKeyMap, componentKeyWord } =
    getGlobalData("@ocean/component");
  const isExist = componentKeyMap.has(name);
  if (isExist) throw Error(`Component '${name}' is already exist.`);
  return function (ctor: any, ...args: any[]) {
    defineProperty(ctor, componentKeyWord, 0, name);
    option?.events && defineProperty(ctor, "__events", 0, option.events);
    componentKeyMap.set(name, ctor);
  };
}
