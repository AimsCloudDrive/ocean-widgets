import { OBSERVERMATHOD } from "./const";

export class Observer {
  private declare handles: Map<() => void, () => void>;
  private declare value: any;
  private declare cancel: (handle: () => void) => boolean;
  constructor() {
    this.handles = new Map();
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.cancel = this.handles.delete.bind(this.handles);
  }
  get() {
    if (OBSERVERMATHOD.getRunningFunction) {
      const handle = OBSERVERMATHOD.getRunningFunction(this.cancel);
      this.handles.set(handle, handle);
    }
    return this.value;
  }
  set(v: any) {
    this.value = v;
    const it = this.handles.values();
    let next = it.next();
    while (next.done) {
      const { value } = next;
      value();
      next = it.next();
    }
  }
}
