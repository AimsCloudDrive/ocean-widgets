export function compareObjects<T extends {}>(
  obj1: T,
  obj2: T,
  ins?: (insers: (string | symbol)[]) => void,
  del?: (dels: (string | symbol)[]) => void
) {
  const oldKeys = new Set(Object.keys(obj1));
  const newKeys = new Set(Object.keys(obj2));
  const insers = [] as (string | symbol)[];
  const dels = [] as (string | symbol)[];

  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      dels.push(key);
    }
    newKeys.delete(key);
  }
  if (newKeys.size) {
    newKeys.forEach((key) => {
      insers.push(key);
    });
  }
  ins && ins(insers);
  del && del(dels);
}
