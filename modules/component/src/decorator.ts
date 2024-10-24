import { COMPONENT_OPTION_KEY, JSTypes, defineProperty } from "@ocean/common";
import { COMPONENT_Map as COMPONENT_MAP, COMPONENTNAME_KEY } from "./context";

export function initComponentOptions(ctor: any): any {
  let OPTIONS = Reflect.get(ctor, COMPONENT_OPTION_KEY);
  if (!OPTIONS) {
    OPTIONS = Object.create({});
    Object.defineProperty(ctor, COMPONENT_OPTION_KEY, {
      enumerable: false,
      value: OPTIONS,
      configurable: false,
      writable: false,
    });
  }
  return OPTIONS;
}

export function option(type: JSTypes): PropertyDecorator {
  return (ctor: any, name: string | symbol) => {
    const isComp = ctor[COMPONENTNAME_KEY];
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

export function component(name: string, option?: {}) {
  const isExist = COMPONENT_MAP.has(name);
  if (isExist) throw Error(`Component '${name}' is already exist.`);
  return function (ctor: any, ...args: any[]) {
    defineProperty(ctor, COMPONENTNAME_KEY, 0, true);
    COMPONENT_MAP.set(name, ctor);
  };
}
