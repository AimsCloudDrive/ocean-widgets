/** @jsx createElement */

import { createElement, render } from "@ocean/dom";
import { component } from "@ocean/component";

@component("OBH")
class OBH {
  constructor(props: any) {}
  render() {
    return <div className={"OBH"}>OBH</div>;
  }
}

@component("A")
class A {
  constructor(props: any) {}
  render() {
    return <div className={"A"}>A</div>;
  }
}

const a = <A></A>;

render(a, document.getElementById("root")!);
