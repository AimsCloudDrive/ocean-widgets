import { thenable } from "./types";

export function isPromiseLike<R extends any = any, E extends Error = Error>(
  data: any
): data is thenable<R, E> {
  return (
    !!data &&
    (typeof data === "function" || typeof data === "object") &&
    typeof data.then === "function" &&
    data.then.length === 2
  );
}
