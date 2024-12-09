import { Component } from "@ocean/component";

export const mountComponent = <T extends Component<any>>(
  component: T,
  anchor: HTMLElement
) => {
  const mount = component.mount();
  mount(anchor);
};
