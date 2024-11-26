/** @jsx createElement */

import { createElement, render } from "@ocean/dom";
import { component, Component, ComponentProps } from "@ocean/component";

@component("A")
class A extends Component<{ AAA: number; class: string } & ComponentProps> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div>A</div>;
  }
}

const a = <A AAA={1} class={"q"}></A>;

render(a, document.getElementById("root")!);
