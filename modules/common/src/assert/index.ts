export function assert(
  condition: any,
  message: string = ""
): condition is true {
  if (!condition) throw Error(message);
  return true;
}
console.assert;
