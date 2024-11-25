import { getGlobalData, setGlobalData, Collection } from "@ocean/common";
import { OcPromise } from "@ocean/promise";

export interface IObserver {
  addReaction(reaction: Reaction): void;
  removeReaction(reaction: Reaction): void;
}

export class Reaction {
  private declare tracker: () => void;
  private declare callback: () => void;
  private declare tracked: WeakMap<IObserver, IObserver>;
  constructor(props: {
    tracker: () => void;
    callback: () => void;
    delay?: "nextTick" | "nextFrame";
  }) {
    this.tracked = new WeakMap();
    this.tracker = props.tracker;
    this.callback =
      props.delay === "nextFrame"
        ? () => requestAnimationFrame(() => props.callback())
        : props.delay === "nextTick"
        ? () =>
            new OcPromise<void>((resolve) => resolve()).then(() =>
              props.callback()
            )
        : () => props.callback();
  }
  track() {
    const { tracker } = this;
    const r = getGlobalData("@ocean/reaction");
    let o;
    setGlobalData(
      "@ocean/reaction",
      (o = {
        ...r,
        tracking: (ob: IObserver) => {
          this.tracked.set(ob, ob);
          ob.addReaction(this);
          return this;
        },
      })
    );
    try {
      tracker();
    } finally {
      setGlobalData("@ocean/reaction", {
        ...o,
        tracking: r.tracking,
      });
    }
  }
  exec() {
    this.callback();
    return this;
  }

  disposer() {
    return this.destroy.bind(this);
  }

  destroy() {
    this.tracked.forEach((ob) => ob.removeReaction(this));
    this.tracked = new WeakMap();
  }
}

export function createReaction(
  tracker: () => void,
  callback: () => void,
  option?: { delay?: "nextTick" | "nextFrame" }
): Reaction;
export function createReaction(
  tracker: () => void,
  option?: { delay?: "nextTick" | "nextFrame" }
): Reaction;

export function createReaction(
  tracker: () => void,
  callback?: (() => void) | { delay?: "nextTick" | "nextFrame" },
  option?: { delay?: "nextTick" | "nextFrame" }
): Reaction {
  if (typeof callback === "function") {
    return new Reaction({ tracker, callback, delay: option?.delay });
  }
  if (typeof callback !== "function") {
    if (callback) {
      if (option) throw "error params.";
      return new Reaction({
        tracker,
        callback: tracker,
        delay: callback.delay,
      });
    } else {
      return new Reaction({ tracker, callback: tracker, delay: option?.delay });
    }
  }
}
