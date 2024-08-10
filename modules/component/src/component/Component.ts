import { COMPONENT_OPTION_KEY, Event } from "@ocean/common";
import { CONTEXT } from "./context";

declare global {
  export namespace Component {
    export interface Context {}
  }
}

export type ComponentProps = {
  $context?: Partial<Component.Context>;
};

function premount() {}

export type ComponentEvents = {};

export abstract class Component<
  P extends ComponentProps = ComponentProps,
  E extends ComponentEvents = ComponentEvents
> extends Event<E> {
  constructor(props: P) {
    super();
    this.$owner = CONTEXT.creating;
    this.init();
    this.set(props);
  }
  declare $owner: Component<any, any>;
  declare $parrent: Component<any, any>;
  declare $context: Partial<Component.Context>;

  getContext<T extends keyof Partial<Component.Context>>(
    key: T
  ): Partial<Component.Context>[T] {
    const $ctx = this.$context;
    const $p = this.getUpComp();
    if ($ctx && $ctx.hasOwnProperty(key)) {
      return $ctx[key];
    }
    return $p?.getContext(key);
  }

  private getUpComp() {
    return this.$owner || this.$parrent;
  }

  init() {}
  set(props: Partial<P>) {
    this.setProps(props);
  }

  setProps(props: Partial<P>) {
    const options = this.getOptions();
    Object.entries(props).forEach(([k, v]: [any, any]) => {
      if (Object.hasOwnProperty.call(options, k)) {
        this[k as keyof typeof this] = v;
      }
    });
  }
  private getOptions() {
    const OPTIONS = Reflect.get(this, COMPONENT_OPTION_KEY) || {};
    return OPTIONS as { [K in keyof P]: any };
  }
  render(): any {}
}
