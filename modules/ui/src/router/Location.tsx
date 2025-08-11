import { Component, ComponentProps, component, option } from "@msom/component";
import { computed, observer } from "@msom/reaction";
import { Router } from "./Router";
import { nil } from "@msom/common";
declare global {
  namespace Component {
    interface Context {
      location: Location;
    }
  }
}

type LocationProps = ComponentProps & {
  location: globalThis.Location;
  globalParamNames?: Array<string>;
};

@component("location")
export class Location extends Component<LocationProps> {
  @option()
  declare location: LocationProps["location"];

  declare routers: Router[];

  init() {
    super.init();
    this.postParams = {};
    this.routers = [];
  }

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

  @computed()
  private get globalParams() {
    return Object.fromEntries(
      Object.entries(this.params).filter(([key]) =>
        this.globalParamNames.includes(key)
      )
    );
  }
  @computed()
  get history() {
    return globalThis.history;
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
    const search = new URLSearchParams(this.params);
    let fullLink = link;

    if (search.size > 0) {
      fullLink += "?" + search.toString();
    }
    if (overrideHash) {
      fullLink += "#" + overrideHash.replace(/^#+/i, "");
    }
    fullLink = fullLink.replace(/^\/+/i, "");
    const prefix = this.origin.replace(/\/+$/i, "");
    return `${prefix}/${fullLink}`;
  }
  jump(link: string, params?: {}, postParams?: {}, overrideHash?: string) {
    this.postParams = postParams || this.postParams;
    const fullLink = this.fullLink(link, params, overrideHash);
    return this.history.pushState({ name: fullLink }, "", fullLink);
  }
  replace(link: string, params?: {}, postParams?: {}, overrideHash?: string) {
    this.postParams = postParams || this.postParams;
    const fullLink = this.fullLink(link, params, overrideHash);
    return this.history.replaceState({ name: fullLink }, "", fullLink);
  }
}
