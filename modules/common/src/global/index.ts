export function setGlobalData(key: string, data: any) {
  Object.assign(globalThis, { [key]: data });
}
export function getGlobalData(key: string) {
  return Reflect.get(globalThis, key);
}
