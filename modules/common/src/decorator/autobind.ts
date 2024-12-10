import { MethodDecorator } from "./types";

export function autobind(): MethodDecorator {
  return (value, context) => {
    if (context.private) {
      throw new TypeError("Not supported on private methods.");
    }
    context.addInitializer(function () {
      value[context.name] = value[context.name].bind(this);
    });
  };
}
