/** @jsx createElement */

import { createElement, render } from "@ocean/dom";
import { component } from "@ocean/component";
import React from "react";

@component("OBH")
class OBH {
  constructor(props: any) {}
  render() {
    return <div>OBH</div>;
  }
}

@component("A")
class A extends React.Component<{ AAA: number }, {}, { BBB: {} }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div>A</div>;
  }
}

const a = <A AAA={1}></A>;

render(a, document.getElementById("root")!);
