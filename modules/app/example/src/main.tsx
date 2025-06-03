/**@jsx createElement */

import { createElement, mountWith } from "@ocean/dom";
import { App } from "@ocean/app";
import "./index.css";
import { Route } from "@ocean/ui";
import { Expample } from "./Example";
const routes: Route[] = [
  {
    path: "/example",
    nav: "example",
    view: () => {
      return <Expample count={10} />;
    },
  },
];

mountWith(() => <App routes={routes} />, document.getElementById("root")!);

export const a = 1;
