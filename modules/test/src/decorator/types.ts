export type ClassFunction = new (...args: any[]) => any;

export type Decorator =
  | MethodDecorator
  | ClassDecorator
  | ParameterDecorator
  | PropertyDecorator
  | AccessorDecorator;
export type ClassDecorator = <TFunction extends ClassFunction = ClassFunction>(
  target: TFunction,
  context: ClassDecoratorContext<TFunction>
) => TFunction | void;
export type PropertyDecorator = (
  target: Object,
  context: ClassFieldDecoratorContext
) => void;
export type AccessorDecorator = (
  target: Object,
  context: ClassAccessorDecoratorContext
) => void;
export type MethodDecorator = (
  target: Object,
  context: ClassMethodDecoratorContext
) => void;
