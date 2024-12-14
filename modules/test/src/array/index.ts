import { tryCall } from "../global";

export function isArray<T>(o: any): o is Array<T> {
  return Array.isArray(o);
}

/**
 * 比较newArr 和 oldArr，找出所有新增和删除的元素的数组, 作为参数分别运行insert和del函数
 * @param newArr
 * @param oldArr
 * @param insert
 * @param del
 */
export function compareArray<T>(
  newArr: T[],
  oldArr: T[],
  insert?: (item: T[]) => void,
  del?: (item: T[]) => void
) {
  const objectKey = new WeakMap<any, symbol>();
  const oldMaps = {
    map: new Map<any, { count: number }>(),
    objectMap: new Map<symbol, { count: number; obj: any }>(),
  };
  const newMaps = {
    map: new Map<any, { count: number }>(),
    objectMap: new Map<symbol, { count: number; obj: any }>(),
  };
  const addMap = (maps: typeof oldMaps, key: any) => {
    if (typeof key === "object" || typeof key === "function" || key === null) {
      let keySymbol = objectKey.get(key);
      if (!keySymbol) {
        // 第一次没有keySymbol，则创建一个
        objectKey.set(key, (keySymbol = Symbol()));
      }
      let value = maps.objectMap.get(keySymbol);
      if (!value) {
        maps.objectMap.set(keySymbol, (value = { count: 0, obj: key }));
      }
      value.count++;
    } else {
      const map = maps.map;
      let value = map.get(key);
      if (!value) {
        map.set(key, (value = { count: 0 }));
      }
      value.count++;
    }
  };
  // 遍历oldArr，将每个元素添加到oldMaps中
  for (let i = 0; i < oldArr.length; i++) {
    addMap(oldMaps, oldArr[i]);
  }
  // 遍历newArr，将每个元素添加到newMaps中
  for (let i = 0; i < newArr.length; i++) {
    addMap(newMaps, newArr[i]);
  }
  const inserts: T[] = [];
  const dels: T[] = [];
  // 普通元素
  for (let [key, value] of oldMaps.map) {
    const news = newMaps.map.get(key);
    if (!news) {
      dels.push(...new Array(value.count).fill(key));
    } else if (news.count < value.count) {
      dels.push(...new Array(value.count - news.count).fill(key));
    } else if (news.count > value.count) {
      inserts.push(...new Array(news.count - value.count).fill(key));
    }
    newMaps.map.delete(key);
  }
  if (newMaps.map.size) {
    for (let [key, value] of newMaps.map) {
      inserts.push(...new Array(value.count).fill(key));
    }
  }
  // 对象元素
  for (let [_, value] of oldMaps.objectMap) {
    const { obj: key } = value;
    const keySymbol = objectKey.get(key);
    if (!keySymbol) {
      continue;
    }
    const news = newMaps.objectMap.get(keySymbol);
    if (!news) {
      dels.push(...new Array(value.count).fill(key));
    } else if (news.count < value.count) {
      dels.push(...new Array(value.count - news.count).fill(key));
    } else if (news.count > value.count) {
      inserts.push(...new Array(news.count - value.count).fill(key));
    }
    newMaps.objectMap.delete(keySymbol);
  }
  if (newMaps.objectMap.size) {
    for (let [_, value] of newMaps.objectMap) {
      inserts.push(...new Array(value.count).fill(value.obj));
    }
  }
  tryCall(insert, [inserts]);
  tryCall(del, [dels]);
}
