import { COMPONENT_OPTION_KEY } from "@ocean/common";

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

export function option(): PropertyDecorator {
  return (ctor: any, name: string | symbol) => {
    const OPTIONS = initComponentOptions(ctor);
    OPTIONS[name] = {
      name,
    };
  };
}
