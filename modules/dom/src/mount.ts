import { Component } from "@ocean/component";
import { render } from "./element";

export const mountComponent = <T extends Component<any>>(
  component: T,
  anchor: HTMLElement
) => {
  const element = component.render();
  render(element, anchor);
  component.rendered();
  component.mounted();
};
