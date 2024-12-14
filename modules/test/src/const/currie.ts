type Curried<A extends any[], R> = A extends []
  ? () => R
  : A extends [infer K]
  ? (arg: K) => R
  : A extends [infer K, ...infer Rest]
  ? (arg: K) => Curried<Rest, R>
  : never;

/**
 * 柯里化
 * @param cb
 * @returns
 * @example
 *   declare function waitCurrYFunc(arg1: number, arg2: string): string {
 *       return args1 + args2;
 *   };
 *   const curried = curry(waitCurrYFunc);
 *   curried(1)("2") // return '12'
 */
export function curry<A extends any[], R>(
  cb: (...args: A) => R
): Curried<A, R> {
  if (cb.length < 2) {
    return cb as Curried<A, R>;
  }
  const args = [] as unknown as A;
  const _curry = <T extends any[]>() => {
    return (arg: T[0]) => {
      args.push(arg);
      if (args.length < cb.length) {
        return _curry<T extends [any, ...infer Rest] ? Rest : never>();
      } else if (args.length === cb.length) {
        return cb(...args);
      } else {
        throw `This function '${cb.name}' can take up to ${cb.length} parameters at most`;
      }
    };
  };
  return _curry() as Curried<A, R>;
}
