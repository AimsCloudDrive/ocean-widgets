import { Reaction, IObserver } from "../Reaction";
import { getGlobalData } from "@ocean/common";

export type ObserverOption<T> = {
  value?: T;
  equal?: (oldValue: T, newValue: T) => boolean;
  // TODO: add more options
};

export class Observer<T = any> implements IObserver {
  private declare handles: Set<Reaction>;
  private declare value: T;
  private declare equal: (oldValue: T, newValue: T) => boolean;
  constructor(option: ObserverOption<T> = {}) {
    this.equal = (oldValue, newValue) => oldValue === newValue;
    Object.assign(this, option);
    this.handles = new Set();
  }
  get(): T {
    const running = getGlobalData("@ocean/reaction");
    if (running?.tracking) {
      running.tracking(this);
    }
    return this.value;
  }
  set(newValue: T) {
    const { value: oldValue } = this;
    if (!this.equal(oldValue, newValue)) {
      this.update();
    }
    this.value = newValue;
  }
  update() {
    for (const reaction of this.handles) {
      reaction.patch();
    }
  }
  addReaction(reaction: Reaction): void {
    this.handles.add(reaction);
  }
  removeReaction(reaction: Reaction): void {
    this.handles.delete(reaction);
  }
}
