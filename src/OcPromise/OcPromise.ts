import { OcPromiseRejectError } from "./OcPromiseError";
import {
  OcThenable,
  OcPromiseStatus,
  OcPromiseExecutor,
  Resolve,
  FULFILLED,
  Reject,
  REJECTED,
  Cancel,
  CANCELED,
  Fulfilled,
  Rejected,
  Canceled,
  PENDDING,
  thenable,
} from "./types";

export class OcPromise<
  R extends any = any,
  E extends OcPromiseRejectError = OcPromiseRejectError,
  C extends any = any
> implements OcThenable<R, E, C>
{
  private declare status: OcPromiseStatus;
  private declare data: R | E | C;
  private declare parrent: OcPromise<any, any, any> | undefined;
  private declare handlers: {
    resolve: (data: any) => void;
    reject: (reason: any) => void;
    cancel: (reason: any) => void;
    onfulfilled?: (data: R) => any | OcThenable<any, E, C>;
    onrejected?: (reason: E) => void;
    oncanceled?: (reason: C) => void;
  }[];
  constructor(executor: OcPromiseExecutor<R, E, C>) {
    this.status = PENDDING;
    this.handlers = [];
    const resolve: Resolve<R> = this.changeStatus.bind(this, FULFILLED);
    const reject: Reject<E> = this.changeStatus.bind(this, REJECTED);
    const cancel: Cancel<C> = this.changeStatus.bind(this, CANCELED);
    try {
      executor(resolve, reject, cancel);
    } catch (e: any) {
      reject(e);
    }
  }

  private changeStatus<
    T extends OcPromiseStatus,
    D extends R | E | C = T extends Fulfilled
      ? R
      : T extends Rejected
      ? R
      : T extends Canceled
      ? C
      : never
  >(status: T, data: D) {
    if (this.status !== PENDDING) {
      return;
    }
    this.status = status;
    this.data = data;
    this._runThens();
  }

  private _runMicreTask(task: () => void) {
    if (MutationObserver) {
      const ob = new MutationObserver(() => task());
      const text = document.createTextNode("1");
      ob.observe(text, { characterData: true });
      text.data = "2";
      ob.disconnect();
    } else {
      setTimeout(() => task(), 0);
    }
  }

  private _runThens() {
    if (this.status === PENDDING) {
      return;
    }
    while (this.handlers.length) {
      const handler = this.handlers.shift();
      if (!handler) break;
      const { resolve, reject, cancel, onfulfilled, oncanceled, onrejected } =
        handler;
      const exe =
        this.status === FULFILLED
          ? onfulfilled
            ? () => onfulfilled(this.data as R)
            : undefined
          : this.status === REJECTED
          ? onrejected
            ? () => onrejected(this.data as E)
            : undefined
          : oncanceled
          ? () => oncanceled(this.data as C)
          : undefined;
      if (!exe) return;
      const task = () => {
        try {
          const data = exe();
          if (!data) {
            resolve(data);
          } else if (this.isOcThenable(data)) {
            data.then(
              resolve,
              reject,
              (reason) => (this.cancel(reason), cancel(reason))
            );
          } else if (OcPromise.isPromiseLike(data)) {
            data.then(resolve, reject);
          } else resolve(data);
        } catch (e) {
          reject(e);
        }
      };
      this._runMicreTask(task);
    }
  }
  then<
    FR extends any = any,
    FE extends Error = OcPromiseRejectError,
    FC extends any = any
  >(
    onfulfilled?: (data: R) => FR | OcThenable<FR, FE, FC>,
    onrejected?: (reason: E) => void,
    oncanceled?: (reason: C) => void
  ): OcPromise<FR, FE, FC> {
    const res = new OcPromise<FR, FE, FC>((resolve, reject, cancel) => {
      this.handlers.push({
        resolve,
        reject,
        cancel,
        onfulfilled,
        onrejected,
        oncanceled,
      });
      this._runThens();
    });
    res.parrent = this;
    return res;
  }
  static isPromiseLike(data: any): data is thenable<any, any> {
    return (
      data &&
      (typeof data === "function" || typeof data === "object") &&
      typeof data.then === "function"
    );
  }
  cancel(reason: C) {
    if (this.parrent) {
      this.parrent.cancel(reason);
    } else {
      this.changeStatus(CANCELED, reason);
    }
  }
  isOcThenable<
    RR extends any = any,
    RE extends Error = OcPromiseRejectError,
    RC extends any = any
  >(data: any): data is OcThenable<RR, RE, RC> {
    return (
      data && typeof data.cancel === "function" && OcPromise.isPromiseLike(data)
    );
  }
}
