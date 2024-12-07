import { getGlobalData, setGlobalData } from "@ocean/common";

export interface IObserver {
  addReaction(reaction: Reaction): void;
  removeReaction(reaction: Reaction): void;
}

declare global {
  export namespace Ocean {
    export interface Store {
      "@ocean/reaction": {
        tracking?: (ob: IObserver) => void;
      };
    }
  }
}

export class Reaction {
  private declare tracker: () => void;
  private declare callback: () => void;
  private declare tracked: Set<IObserver>;
  private declare delay: "nextTick" | "nextFrame" | undefined;
  // 是否已经在等待执行
  private declare cancel?: () => void;
  constructor(props: {
    tracker: () => void;
    callback: () => void;
    delay?: "nextTick" | "nextFrame";
  }) {
    this.tracked = new Set();
    Object.assign(this, props);
    this.track();
  }
  nextTick(cb: () => void) {
    // 将函数放进为队列中，等待执行
    this.cancel && this.cancel();
    if (this.delay === "nextTick") {
      // 判断浏览器环境还是node环境
      if (typeof process !== "undefined" && process.nextTick) {
        process.nextTick(cb);
        this.cancel = () => {
          // 取消nextTick的对调函数执行
        };
      } else {
        queueMicrotask(() => {
          cb();
          this.cancel = undefined;
        });
      }
    } else if (this.delay === "nextFrame") {
      const rafId = requestAnimationFrame(() => {
        cb();
        this.cancel = undefined;
      });
      this.cancel = () => cancelAnimationFrame(rafId);
    } else {
      cb();
    }
  }
  track() {
    const { tracker } = this;
    let r = getGlobalData("@ocean/reaction");
    if (!r) {
      setGlobalData("@ocean/reaction", (r = {}));
    }
    let o;
    setGlobalData(
      "@ocean/reaction",
      (o = {
        ...r,
        tracking: (ob: IObserver) => {
          this.tracked.add(ob);
          ob.addReaction(this);
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
    this.tracked.clear();
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
  } else {
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
