import {
  COMPONENT_OPTION_KEY,
  Event,
  Nullable,
  getGlobalData,
  parseClass,
  setGlobalData,
} from "@ocean/common";
import { component, option } from "../decorator";

declare global {
  export namespace Component {
    export interface Context {}
  }
}
declare global {
  export namespace Ocean {
    export interface Store {
      "@ocean/component": {
        componentKeyWord: symbol;
        componentKeyMap: Map<string, any>;
        rendering?: Component;
      };
    }
  }
}
setGlobalData("@ocean/component", {
  componentKeyWord: Symbol("component"),
  componentKeyMap: new Map<string, any>(),
});

interface IComponent<P, E> {
  props: P;
  context: Partial<Component.Context>;
  setProps(props: P): void;
  forceUpdate(): void;
}

export type ComponentProps = {
  $context?: Partial<Component.Context>;
  $key?: string | number;
};

export type ComponentEvents = {};

@component("component")
export class Component<
    P extends ComponentProps = ComponentProps,
    E extends ComponentEvents = ComponentEvents
  >
  extends Event<E>
  implements IComponent<P, E>
{
  setState: any;
  state: any;
  refs: any;

  @option()
  private declare $key: string | number | Nullable;
  @option()
  private declare $context?: Partial<Component.Context>;
  declare el: HTMLElement;
  constructor(props: P) {
    super();
    this.$props = this.props = props;
    this.init();
    this.set(props);
  }
  declare context: any;
  private declare $props: P;
  declare props: P;
  forceUpdate(): void {}
  declare $owner: Component<any, any>;
  declare $parent: Component<any, any>;

  getClassName(): string {
    const p = this.$props as any;
    return p.class ? parseClass(p.class) : "";
  }
  getStyle(): string {
    return "";
  }

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
  rendered(): void {}
}

export function isComponent(ctor: any) {
  const { componentKeyWord: componentKey, componentKeyMap: componentMap } =
    getGlobalData("@ocean/component");
  const name = ctor[componentKey];
  if (name == undefined) {
    return false;
  }
  if (!!componentMap.get(name)) {
    return true;
  }
  return false;
}
