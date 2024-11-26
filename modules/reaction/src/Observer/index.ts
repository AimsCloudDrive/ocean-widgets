import { Reaction, IObserver } from "../Reaction";
import { getGlobalData } from "@ocean/common";

export class Observer<T = any> implements IObserver {
  private declare handles: Set<Reaction>;
  private declare value: T;
  constructor() {
    this.handles = new Set();
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }
  get(): T {
    const running = getGlobalData("@ocean/reaction");
    if (running?.tracking) {
      running.tracking(this);
    }
    return this.value;
  }
  set(v: T) {
    this.value = v;
    this.update();
  }
  update() {
    for (const reaction of this.handles) {
      reaction.exec();
    }
  }
  addReaction(reaction: Reaction): void {
    this.handles.add(reaction);
  }
  removeReaction(reaction: Reaction): void {
    this.handles.delete(reaction);
  }
}
