/** @jsx createElement */

import { createElement, render } from "@ocean/dom";
import { component } from "@ocean/component";

@component("OBH")
class OBH {
  constructor(props: any) {}
  render() {
    return <div>OBH</div>;
  }
}

@component("A")
class A {
  constructor(props: any) {}
  render() {
    return <div>A</div>;
  }
}

const a = <A></A>;

render(a, document.getElementById("root")!);
