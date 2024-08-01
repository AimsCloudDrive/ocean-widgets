import { OBSERVERMATHOD } from "./const";

export class Reaction {
  private declare tracker: () => void;
  private declare callback: () => void;
  private declare users: ((handle: () => void) => void)[];
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
    OBSERVERMATHOD.getRunningFunction = (cancel) => {
      this.users.push(cancel);
      return this.callback;
    };
    this.tracker();
    OBSERVERMATHOD.getRunningFunction = undefined;
  }
  exec() {
    this.callback();
    return this;
  }

  disposer() {
    return () => {
      this.users.forEach((cancel) => cancel(this.callback));
    };
  }
}
