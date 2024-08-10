import { getGlobalData, setGlobalData } from "@ocean/common";

export interface IObserver {
  addReaction(reaction: Reaction): void;
  removeReaction(reaction: Reaction): void;
}

export class Reaction {
  private declare tracker: () => void;
  private declare callback: () => void;
  private declare users: IObserver[];
  constructor(props: {
    tracker: () => void;
    callback: () => void;
    delay?: boolean;
  }) {
    this.tracker = props.tracker;
    const delay = props.delay === true;
    // 若延迟 则下一帧运行
    this.callback = delay
      ? () => requestAnimationFrame(() => props.callback())
      : props.callback;
  }
  track() {
    const { tracker, callback } = this;
    const r = getGlobalData("@ocean/reaction");
    let o;
    setGlobalData(
      "@ocean/reaction",
      (o = {
        ...r,
        tracking: (ob: IObserver) => {
          this.users.push(ob);
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
    return () => {
      this.users.forEach((ob) => ob.removeReaction(this));
    };
  }
}
