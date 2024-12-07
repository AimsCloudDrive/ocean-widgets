import { OcPromiseRejectError } from "./OcPromiseError";
import { Nullable, createFunction } from "@ocean/common";
import {
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
  ReturnTypeNotUndeF,
  OcPromiseStatus,
} from "./types";
import { isPromiseLike } from "./utils";
import { nextTick } from "../nextTick";

export class OcPromise<
  R extends any = any,
  E extends OcPromiseRejectError = OcPromiseRejectError,
  C extends any = any
> {
  declare status: OcPromiseStatus;
  private declare handlers: {
    resolve: Resolve<any>;
    reject: Reject<any>;
    cancel: Cancel<any>;
    onfulfilled: Nullable | createFunction<[R, any]>;
    onrejected: Nullable | createFunction<[E, any]>;
    oncanceled: Nullable | createFunction<[C, any]>;
  }[];
  declare data: R | E | C;
  private declare parrent: OcPromise<any, any, any> | undefined;
  constructor(executor: OcPromiseExecutor<R, E, C>) {
    this.status = PENDDING;
    this.handlers = [];
    const resolve: Resolve<R> = (data: R) => {
      this.changeStatus(FULFILLED, data);
    };
    const reject: Reject<E> = (reason: E) => {
      this.changeStatus(REJECTED, reason);
    };
    const cancel: Cancel<C> = (reason: C) => {
      this.changeStatus(CANCELED, reason);
    };
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

  private _runThens() {
    if (this.status === PENDDING) {
      return;
    }
    while (this.handlers.length) {
      const handler = this.handlers.shift()!;
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
      if (!exe) continue;
      const task = () => {
        try {
          const data = exe();
          if (isOcPromise(data)) {
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
      nextTick(task);
    }
  }
  then<
    TR extends Nullable | createFunction<[R, any]>,
    TE extends Nullable | createFunction<[E, any]>,
    TC extends Nullable | createFunction<[C, any]>,
    FR = ReturnTypeNotUndeF<TR | TE | TC>
  >(
    onfulfilled?: TR,
    onrejected?: TE,
    oncanceled?: TC
  ): OcPromise<FR, Error, any> {
    const res = new OcPromise<FR, Error, any>((resolve, reject, cancel) => {
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
        if (isOcPromise<Awaited<T>, any, any>(value)) {
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

  static resolve<T = void>(value: T): OcPromise<T> {
    if (isOcPromise<T>(value)) {
      return value;
    }
    if (isPromiseLike<T>(value)) {
      return new OcPromise<T>((resolve, reject) => {
        value.then(resolve, reject);
      });
    }
    return new OcPromise((resolve) => {
      resolve(value);
    });
  }

  static reject<E extends OcPromiseRejectError = any>(
    reason: E
  ): OcPromise<any, E> {
    return new OcPromise((_, reject) => {
      reject(reason);
    });
  }

  canceled(oncanceled: Cancel<C>) {
    return this.then(null, null, oncanceled);
  }
  catch(onRejected: Reject<E>) {
    return this.then(null, onRejected, null);
  }
  getData() {
    return this.data;
  }
  getStatus() {
    return this.status;
  }
}

export function isOcPromise<
  PR extends any = any,
  PE extends Error = OcPromiseRejectError,
  PC extends any = any
>(data: any): data is OcPromise<PR, PE, PC> {
  return data && typeof data.cancel === "function" && isPromiseLike(data);
}
