import { addSample } from "@msom/gallay";
import { App } from "@msom/app";
import { mountComponent } from "@msom/dom";

const app = new App({ routes: [] });

mountComponent(app, document.getElementById("root")!);
