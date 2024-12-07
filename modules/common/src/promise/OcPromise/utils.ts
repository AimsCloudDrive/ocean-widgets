import { OcPromiseRejectError } from "./OcPromiseError";
import { OcThenable, thenable } from "./types";

export function isPromiseLike<R extends any = any, E extends Error = Error>(
  data: any
): data is thenable<R, E> {
  return (
    data &&
    (typeof data === "function" || typeof data === "object") &&
    typeof data.then === "function"
  );
}

export function isOcThenable<
  PR extends any = any,
  PE extends Error = OcPromiseRejectError,
  PC extends any = any
>(data: any): data is OcThenable<PR, PE, PC> {
  return data && typeof data.cancel === "function" && isPromiseLike(data);
}
