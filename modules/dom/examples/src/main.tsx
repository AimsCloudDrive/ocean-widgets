/** @jsx createElement */

import { Component, ComponentProps } from "@ocean/component";
import { createElement, render } from "@ocean/dom";

class C extends Component<ComponentProps & { A: string }, {}> {
  render() {
    return <div>c</div>;
  }
}

render(<C A={1}></C>, document.getElementById("root")!);
