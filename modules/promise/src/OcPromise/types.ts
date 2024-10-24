import { Nullable, createFunction } from "@ocean/common";
import { OcPromiseRejectError } from "./OcPromiseError";

export interface thenable<R extends any, E extends Error> {
  then<
    TR extends Nullable | createFunction<[R, any]>,
    TE extends Nullable | createFunction<[E, any]>,
    FR = ReturnTypeNotUndeF<TR | TE>
  >(
    onfulfilled: TR,
    onrejected: TE
  ): thenable<FR, Error>;
}

export type ReturnTypeNotUndeF<T = any> = T extends (...args: any[]) => infer R
  ? R
  : never;

export interface OcThenable<
  R extends any = any,
  E extends Error = OcPromiseRejectError,
  C extends any = any
> extends thenable<R, E> {
  then<
    TR extends Nullable | createFunction<[R, any]>,
    TE extends Nullable | createFunction<[E, any]>,
    TC extends Nullable | createFunction<[C, any]>,
    FR = ReturnTypeNotUndeF<TR | TE | TC>
  >(
    onfulfilled?: TR,
    onrejected?: TE,
    oncanceled?: TC
  ): OcThenable<FR, Error, any>;
  cancel(reason: C): void;
  canceled(oncanceled: Cancel<C>): void;
}

export const PENDDING = "pendding";
export const FULFILLED = "fulfilled";
export const REJECTED = "rejected";
export const CANCELED = "canceled";

export type Pendding = typeof PENDDING;
export type Fulfilled = typeof FULFILLED;
export type Rejected = typeof REJECTED;
export type Canceled = typeof CANCELED;

export type OcPromiseStatus = Fulfilled | Rejected | Canceled | Pendding;

export type Resolve<R extends any = any> = (data: R) => void;
export type Reject<E extends Error = OcPromiseRejectError> = (
  reason: E
) => void;
export type Cancel<C extends any = any> = (reason: C) => void;

export type OcPromiseExecutor<
  R extends any = any,
  E extends Error = OcPromiseRejectError,
  C extends any = any
> = createFunction<[Resolve<R>, Reject<E>, Cancel<C>, void]>;
