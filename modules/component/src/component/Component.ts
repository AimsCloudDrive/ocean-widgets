import { COMPONENT_OPTION_KEY, Event } from "@ocean/common";
import { IComponent } from "./IComponent";

export type ComponentProps = {};

export type ComponentEvents = {};

export class Component<
    P extends ComponentProps = ComponentProps,
    E extends ComponentEvents = ComponentEvents
  >
  extends Event<E>
  implements IComponent<P>
{
  constructor(props: P) {
    super();
    this.init();
    this.set(props);
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
  getOptions() {
    const OPTIONS = Reflect.get(this, COMPONENT_OPTION_KEY) || {};
    return OPTIONS as { [K in keyof P]: any };
  }
  render(): any {}
}
