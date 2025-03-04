import {
  Component,
  ComponentProps,
  component,
  option,
  observer,
} from "@ocean/component";
import { Router } from "./Router";
declare global {
  namespace Component {
    interface Context {
      location: Location;
    }
  }
}

type LocationProps = ComponentProps & {
  location: Window["location"];
  globalParamNames?: Array<string>;
};

@component("location")
export class Location extends Component<LocationProps> {
  @option()
  declare location: LocationProps["location"];

  init() {
    super.init();
    this.postParams = {};
    this.routers = [];
  }
  declare routers: [Router][];

  @observer()
  declare path: string;

  declare pathName: string;

  constructor(props: any) {
    super(props);
    const search = new URLSearchParams(this.location.search);
    this.path = search.get("route") || "/";
    this.pathName = this.location.pathname;
    this.params = Object.fromEntries(search.entries());
    this.hash = this.location.hash;
    this.origin = this.location.origin;
    this.globalParamNames = this.globalParamNames || [];
  }

  @option()
  @observer()
  declare globalParamNames: Array<string>;

  @observer()
  declare params: Record<string, any>;

  @observer()
  declare postParams: Record<string, any>;

  @observer()
  declare hash: string;

  declare origin: string;

  private get globalParams() {
    return Object.fromEntries(
      Object.entries(this.params).filter(([key]) =>
        this.globalParamNames.includes(key)
      )
    );
  }
  // 构造完整url
  private fullLink(link: string, params?: {}, overrideHash?: string) {
    const globalParams = this.globalParams;
    if (!params) {
      params = {};
    }
    if (globalParams) {
      params = { ...globalParams, ...params };
    }
    this.params = params;
    this.hash = overrideHash || "";
    this.path = link;
    const search = new URLSearchParams().toString();
    const fullLink = `${link}${search ? `?${search}` : ""}${
      overrideHash ? `#${overrideHash}` : ""
    }`;
    return `${this.origin}/${fullLink}`;
  }
  jump(link: string, params?: {}, postParams?: {}, overrideHash?: string) {
    const fullLink = this.fullLink(link, params, overrideHash);
    this.location.assign(fullLink);
  }
  replace(link: string, params?: {}, postParams?: {}, overrideHash?: string) {
    const fullLink = this.fullLink(link, params, overrideHash);
    this.location.replace(fullLink);
  }
}
