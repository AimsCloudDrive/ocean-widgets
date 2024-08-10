import { Reaction, IObserver } from "./Reaction";
import { getGlobalData } from "@ocean/common";

export class Observer implements IObserver {
  private declare handles: Map<Reaction, Reaction>;
  private declare value: any;
  constructor() {
    this.handles = new Map();
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }
  get() {
    const running = getGlobalData("@ocean/reaction");
    if (running?.tracking) {
      running.tracking(this);
    }
    return this.value;
  }
  set(v: any) {
    this.value = v;
    const it: Iterator<Reaction, Reaction> = this.handles.values();
    let { done, value } = it.next();
    while (done) {
      value.exec();
      ({ done, value } = it.next());
    }
  }
  addReaction(reaction: Reaction): void {
    this.handles.set(reaction, reaction);
  }
  removeReaction(reaction: Reaction): void {
    this.handles.delete(reaction);
  }
}
