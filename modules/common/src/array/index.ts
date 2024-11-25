export function isArray<T>(o: any): o is Array<T> {
  return Array.isArray(o);
}
