export interface IComponent<P extends {}> {
  getOptions(): {
    [K in keyof P]: any;
  };
  init(): void;
  set(props: Partial<P>): void;
  setProps(props: Partial<P>): void;
}
