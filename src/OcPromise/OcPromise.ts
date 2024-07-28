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
import { isOcThenable, isPromiseLike } from "./utils";

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
    const resolve: Resolve<R> = (data: R) => this.changeStatus(FULFILLED, data);
    const reject: Reject<E> = (data: E) => this.changeStatus(REJECTED, data);
    const cancel: Cancel<C> = (data: C) => this.changeStatus(CANCELED, data);
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

  private _runMicroTask(task: () => void) {
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
          } else if (isOcThenable(data)) {
            data.then(
              resolve,
              reject,
              (reason) => (this.cancel(reason), cancel(reason))
            );
          } else if (isPromiseLike(data)) {
            data.then(resolve, reject);
          } else resolve(data);
        } catch (e) {
          reject(e);
        }
      };
      this._runMicroTask(task);
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
    return data && typeof data.cancel === "function" && isPromiseLike(data);
  }

  static all<T>(
    proms: Iterable<T | thenable<Awaited<T>, any>>
  ): OcPromise<Awaited<T>[]> {
    const result: Awaited<T>[] = [];
    return new OcPromise<Awaited<T>[]>((resolve, reject, cancel) => {
      const _resolve = (data: Awaited<T>, index: number) => {
        result[index] = data;
        finished++;
        if (finished === i) resolve(result);
      };
      let i: number = 0,
        finished: number = 0;
      const iterator = proms[Symbol.iterator]();
      let next: ReturnType<typeof iterator.next> = iterator.next();
      while (!next.done) {
        const j = i;
        i++;
        const { value } = next;
        if (isOcThenable<Awaited<T>, any, any>(value)) {
          value.then((data) => _resolve(data, j), reject, cancel);
        } else if (isPromiseLike<Awaited<T>, any>(value)) {
          value.then((data) => _resolve(data, j), reject);
        } else {
          result[j] = value as Awaited<T>;
          finished++;
        }
        next = iterator.next();
      }
      if (finished === i) resolve(result);
    });
  }
  getData() {
    return this.data;
  }
  getStatus() {
    return this.status;
  }
}
