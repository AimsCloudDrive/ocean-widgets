import { COMPONENT_OPTION_KEY, Event, IEvent } from "@ocean/common";
import { CONTEXT } from "./context";
import { Component as RCompnent } from "react";

declare global {
  export namespace Component {
    export interface Context {}
  }
}

export abstract class IComponent<P = any, E extends {} = any>
  extends RCompnent<P>
  implements Event<E>
{
  declare events: {
    [K in keyof E]: ((event: E[K], type: K, self: Event<E>) => void)[];
  };
  constructor(props: P) {
    super(props);
    this.events = Object.create(null);
  }
  on<T extends keyof E>(
    type: T,
    handler: (event: E[T], type: T, self: Event<E>) => void
  ) {
    let handlers = this.events[type];
    if (!handlers) {
      handlers = this.events[type] = [];
    }
    handlers.push(handler);
    return this;
  }
  un<T extends keyof E>(
    type: T,
    handler: (event: E[T], type: T, self: Event<E>) => void
  ) {
    let handlers = this.events[type];
    if (!handlers) {
      return this;
    }
    const index = handlers.findIndex((_handler) => handler === _handler);
    if (index === -1) return this;
    handlers.splice(index, 1);
    return this;
  }
  emit<T extends keyof E>(type: T, event: E[T]) {
    let handlers = this.events[type];
    if (!handlers) {
      return;
    }
    handlers.forEach((handler) => handler(event, type, this));
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
> extends IComponent<P, E> {
  constructor(props: P) {
    super(props);
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
