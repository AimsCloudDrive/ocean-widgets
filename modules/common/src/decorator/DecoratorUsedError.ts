export class ObserverDecoratorUsedError extends Error {
  constructor() {
    // 仅用于实例属性
    super(`"observer decorator only be used with instance property."`);
  }
}

export class OptionDecoratorUsedError extends Error {
  constructor() {
    super(
      `"option decorator only be used with instance property or accessor property for setter."`
    );
  }
}
export class ComponentDecoratorUsedError extends Error {
  constructor() {
    super(`"component decorator can not be used with class."`);
  }
}
