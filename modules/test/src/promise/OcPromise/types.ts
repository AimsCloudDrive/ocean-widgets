import { Nullable, createFunction } from "../../global";
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
  cancel?(): void;
}

export type ReturnTypeNotUndeF<T = any> = T extends (...args: any[]) => infer R
  ? R
  : never;

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
