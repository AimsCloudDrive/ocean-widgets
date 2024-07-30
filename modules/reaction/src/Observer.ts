import { OBSERVERMATHOD } from "./const";

export class Observer {
  private declare handles: (() => any)[];
  private declare value: any;
  constructor() {
    this.handles = [];
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }
  get() {
    if (OBSERVERMATHOD.method) {
      this.handles.push(OBSERVERMATHOD.method);
    }
    return this.value;
  }
  set(v: any) {
    this.value = v;
    this.handles.forEach((v) => v());
  }
}
