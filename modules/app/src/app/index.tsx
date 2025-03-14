/**@jsx createElement */
import { createElement, Context } from "@ocean/dom";
import {
  Component,
  ComponentProps,
  component,
  option,
  observer,
} from "@ocean/component";
import { Location, Router, Route } from "@ocean/ui";

type AppProps = ComponentProps & {
  routes: Route[];
  globalParamNames?: string[];
};
@component("app")
export class App extends Component<AppProps> {
  private declare userInfo: {
    user: string;
    token: string;
  };
  private declare location: Location;
  @option()
  @observer()
  routes: Route[];

  constructor(props: AppProps) {
    super(props);
    this.location = new Location({
      location,
      globalParamNames: props.globalParamNames || [],
    });
    this.context = { location: this.location };
    Object.assign(window, { app: this });
  }

  whatPage() {}

  loginPage() {}

  loadingPage() {}

  renderMenu() {
    return <div>{"renderMenu"}</div>;
  }

  mainPage() {
    return (
      <div class={"app-main-page"}>
        <div class={"app-menu"}>{this.renderMenu()}</div>
        {/* // TODO: 分隔线 纵向 */}
        <div class={"app-main-container"}>
          <Router routes={this.routes}></Router>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Context $context={this.context}>
        <div class={[this.getClassName(), "app"]}>{this.mainPage()}</div>
      </Context>
    );
  }
  componentDidMount(): void {}
}
