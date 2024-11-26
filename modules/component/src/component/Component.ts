import { COMPONENT_OPTION_KEY, Event, IEvent, Nullable } from "@ocean/common";
import { COMPONENTNAME_KEY, COMPONENT_Map, CONTEXT } from "../context";
import { component, option } from "../decorator";

declare global {
  export namespace Component {
    export interface Context {}
  }
}

interface IComponent<P, E> {
  props: P;
  context: Partial<Component.Context>;
  setProps(props: P): void;
  forceUpdate(): void;
}

export type ComponentProps = {
  $context?: Partial<Component.Context>;
};

export type ComponentEvents = {};

@component("component")
export abstract class Component<
    P extends ComponentProps = ComponentProps,
    E extends ComponentEvents = ComponentEvents
  >
  extends Event<E>
  implements IComponent<P, E>
{
  declare el: HTMLElement;
  constructor(props: P) {
    super();
    this.$owner = CONTEXT.creating;
    this.$props = this.props = props;
    this.init();
    this.set(props);
  }
  @option("undefined")
  declare $key: string | number | Nullable;
  private declare $props: P;
  declare props: P;
  declare context: any;
  forceUpdate(): void {}
  declare $owner: Component<any, any>;
  declare $parent: Component<any, any>;
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
    return this.$owner || this.$parent;
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

export function isComponent(ctor: any) {
  const name = ctor[COMPONENTNAME_KEY];
  if (name == undefined) {
    return false;
  }
  if (!!COMPONENT_Map.get(name)) {
    return true;
  }
  return false;
}
