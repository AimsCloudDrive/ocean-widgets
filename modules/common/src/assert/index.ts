export function assert(
  condition: any,
  message: string = ""
): asserts condition {
  if (!condition) throw Error(message);
}

export function nil<T>(data: T | undefined, defaultData: T): T {
  if (data == undefined) {
    return defaultData;
  }
  return data;
}
