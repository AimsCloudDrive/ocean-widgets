/** @jsx createElement */
import { Nullable, OcPromise, defineProperty } from "@msom/common";
import {
  Component,
  ComponentProps,
  component,
  option,
  Context,
} from "@msom/component";
import { createElement } from "@msom/dom";
import { createReaction, observer, withoutTrack } from "@msom/reaction";
declare global {
  namespace Component {
    interface Context {
      router: Router;
    }
  }
}

type Funcable<T extends any, P extends any[] = []> = T | ((...p: P) => T);

type Nav = string | Array<string>;

export type Route = {
  nav?: Funcable<Nav | [Nav, OcPromise<Nav>], [Router]>;
  path: string;
  view?: (router: Router) => Msom.MsomNode;
  children?: Array<Route>;
};

type RouteMatch = Route & {
  routePath: string;
  query: Record<string, string>;
};

type RouterProps = ComponentProps & {
  routes: Array<Route>;
  notMatchPage?: Funcable<Msom.MsomNode>;
};

@component("router")
export class Router extends Component<RouterProps> {
  @observer()
  declare routePath: string;
  @observer()
  declare path: string;

  @option()
  @observer()
  declare routes: Array<Route>;
  @option()
  @observer()
  declare notMatchPage: Funcable<Msom.MsomNode>;

  @observer()
  declare params: Record<string, any>;

  @observer()
  declare postParams: Record<string, any>;

  @observer()
  declare query: RouteMatch["query"];

  @observer()
  declare current:
    | {
        matched: Array<RouteMatch>;
        route: RouteMatch;
      }
    | Nullable;

  @observer()
  declare history: Array<RouteMatch>;

  declare context: {
    router: Router;
  };

  init(): void {
    super.init();
    this.history = new Array();
  }
  private declare parent: Router | null;

  get location() {
    return this.getContext("location");
  }

  constructor(props: RouterProps) {
    super(props);
    this.onclean(
      createReaction(() => {
        const { location } = this;
        if (!location) {
          return;
        }
        location.routers.push(this);
        this.parent = this.getContext("router") || null;
        this.context = { router: this };
        const path = this.parent ? this.parent.routePath : location.path;
        const params = this.parent ? this.parent.params : location.params;
        const postParams = this.parent
          ? this.parent.postParams
          : location.postParams;
        withoutTrack(() => {
          this.params = params;
          this.postParams = postParams;
          const matched = this.match(path);
          if (matched && matched.length > 0) {
            const route = matched[matched.length - 1];
            this.current = { matched, route };
            this.path = route.path;
            this.routePath = route.routePath;
            this.query = route.query;
          } else {
            this.current = null;
            this.path = "";
            this.routePath = path;
            this.query = {};
          }
        });
      }).disposer()
    );
  }

  match(path: string): RouteMatch[] {
    return matchRoute(this.routes, path);
  }

  render() {
    const { current } = this;
    const { route = {} as RouteMatch } = current || {};
    const {
      view = typeof this.notMatchPage === "function"
        ? this.notMatchPage
        : this.notMatchPage !== undefined
        ? () => this.notMatchPage
        : () => (
            <div>
              <span>Not Page Found!</span>
            </div>
          ),
    } = route;
    return (
      <div class={[this.getClassName(), "router"]} style={this.getStyle()}>
        <Context $context={this.context}>{view(this)}</Context>
      </div>
    );
  }
  jump(link: string, params?: {}, postParams?: {}, overrideHash?: string) {
    return this.location?.jump(link, params, postParams, overrideHash);
  }
  replace(link: string, params?: {}, postParams?: {}, overrideHash?: string) {
    return this.location?.replace(link, params, postParams, overrideHash);
  }
}

const queryRExp = /^\/:/i;

export function matchRoute(
  routes: RouterProps["routes"],
  link: string,
  matched: RouteMatch[] = [],
  query: RouteMatch["query"] = {}
): RouteMatch[] {
  for (const route of routes) {
    const { path, children } = route;
    if (link.startsWith(path)) {
      const routePath = link.slice(path.length);
      matched.push({ ...route, routePath, query });
      if (children) {
        matchRoute(children, routePath, matched, query);
      }
      break;
    }
    if (queryRExp.test(path)) {
      const key = path.replace(queryRExp, "");
      const links = link.split("/");
      const queryValue = links[1];
      const routePath = links.toSpliced(1, 1).join("/");
      const _query = Object.create(query);
      defineProperty(_query, key, 7, queryValue);
      matched.push({ ...route, routePath, query: _query });
      if (children) {
        matchRoute(children, routePath, matched, _query);
      }
      break;
    }
  }
  return matched;
}
