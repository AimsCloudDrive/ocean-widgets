import {
  Component,
  ComponentEvents,
  ComponentProps,
  component,
  option,
} from "@ocean/component";
import { observer } from "@ocean/reaction";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

@component("expample", {
  events: {
    countChange: "number",
  },
})
export class Expample extends Component<
  ComponentProps & { count: number },
  ComponentEvents & {
    countChange: number;
  }
> {
  @observer()
  @option()
  declare count: number;
  init() {
    super.init();
    this.count = 0;
  }
  render() {
    return (
      <div>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button
            onclick={() => {
              this.count++;
              this.emit("countChange", this.count);
            }}
          >
            count is {this.count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    );
  }
}

export default Expample;
