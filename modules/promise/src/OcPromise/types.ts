import { Nullable, createFunction } from "@ocean/common";
import { OcPromiseRejectError } from "./OcPromiseError";

export interface thenable<R extends any, E extends Error> {
  then<RR extends any, EE extends Error>(
    onfulfilled: (data: R) => RR | thenable<RR, EE>,
    onrejected: (reason: E) => void
  ): thenable<RR, Error>;
}

export interface OcThenable<
  R extends any = any,
  E extends Error = OcPromiseRejectError,
  C extends any = any
> {
  then<FR extends any, FE extends Error, FC extends any>(
    onfulfilled: Nullable | createFunction<[R, FR | OcThenable<FR, FE, FC>]>,
    onrejected: Nullable | Reject<E>,
    oncanceled: Nullable | Cancel<C>
  ): OcThenable<FR, FE, FC>;
  cancel(reason: C): void;
  canceled(oncanceled: Cancel<C>): void;
}

export type Pendding = "pendding";
export type Fulfilled = "fulfilled";
export type Rejected = "rejected";
export type Canceled = "canceled";

export type OcPromiseStatus = Fulfilled | Rejected | Canceled | Pendding;

export const PENDDING = "pendding";
export const FULFILLED = "fulfilled";
export const REJECTED = "rejected";
export const CANCELED = "canceled";

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
