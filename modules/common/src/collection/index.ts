import { Nullable, createFunction } from "..";
import { Event } from "../Event";
import { assert } from "../assert";

export type CollectionEvent<T = any> = {};

export type CollectionKey = string | number;

export type CollectionGetKey<T = any> = (data: T) => CollectionKey;

export class Collection<T = any>
  extends Event<CollectionEvent<T>>
  implements Iterable<T>
{
  private declare getKey: CollectionGetKey<T>;

  private declare elements: Array<T>;
  private declare elMap: Map<CollectionKey, T>;
  private declare indexMap: Map<CollectionKey, number>;

  constructor(getKey?: CollectionGetKey<T>) {
    super();
    assert(getKey, "miss get unique key");
    this.getKey = getKey;
    this.elements = new Array<T>();
    this.elMap = new Map<CollectionKey, T>();
    this.indexMap = new Map<CollectionKey, number>();
  }

  get(key: CollectionKey) {
    return this.elMap.get(key);
  }
  hasKey(key: CollectionKey) {
    return this.elMap.has(key);
  }
  hasElement(element: T) {
    return this.hasKey(this.getKey(element));
  }
  /**
   *
   * @param element 被添加的元素
   * @param force 当元素存在时是否替换 默认false
   */
  add(element: T, force?: boolean) {
    const key = this.getKey(element);
    const has = this.elMap.has(key);
    if (!has) {
      const index = this.elements.push(element) - 1;
      this.indexMap.set(key, index);
      this.elMap.set(key, element);
    } else if (force) {
      const index = this.indexMap.get(key);
      assert(index);
      this.elMap.set(key, element);
      this.elements.splice(index, 1, element);
    }
  }
  /**
   *
   * @param key 指定元素key
   * @param element 添加元素
   * @param force 当元素存在时是否替换，默认false
   */
  addKey(key: CollectionKey, element: T, force?: boolean) {
    const has = this.elMap.has(key);
    if (!has) {
      const index = this.elements.push(element) - 1;
      this.indexMap.set(key, index);
      this.elMap.set(key, element);
    } else if (force) {
      const index = this.indexMap.get(key);
      assert(index);
      this.elMap.set(key, element);
      this.elements.splice(index, 1, element);
    }
  }
  /**
   *
   * @param iterator 待添加的元素序列
   * @param force 当元素存在时是否替换 默认false
   */
  addAll(iterator: Iterable<T>, force?: boolean) {
    const { next }: Iterator<T, T> = iterator[Symbol.iterator]();
    while (1) {
      const { value, done } = next();
      if (done) break;
      this.add(value, force);
    }
  }
  /**
   *
   * @param element 待插入的元素
   * @param index 插入位置 [0, length]
   * @param exist 当元素存在时
   */
  insert(
    element: T,
    index: number,
    exist?: { index?: boolean; element?: boolean }
  ) {
    const key = this.getKey(element);
    const has = this.elMap.has(key);
    const { index: cIndex, element: cElement } = exist || {};
    if (!has) {
      this.elMap.set(key, element);
      index = Math.min(this.elements.length, Math.max(0, index));
      this.elements.splice(index, 0, element);
    } else {
      const oIndex = this.indexMap.get(key);
      assert(oIndex);
      const oElement = this.elements[oIndex];
      const placeholder = Symbol("placegholder");
      this.elements[oIndex] = placeholder as any;
      if (!cIndex) {
        index = oIndex;
      }
      if (!cElement) {
        element = oElement;
      }
      this.elements.splice(index, 0, element);
      this.elements = this.elements.filter((v) => v !== placeholder);
      this.updateIndexMap();
    }
  }
  removeElement(element: T): this {
    const key = this.getKey(element);
    return this.remove(key);
  }
  remove(key: CollectionKey): this {
    const has = this.elMap.has(key);
    if (has) {
      const index = this.indexMap.get(key);
      assert(index);
      this.elements.splice(index, 1);
      this.updateIndexMap();
      this.elMap.delete(key);
    }
    return this;
  }
  clear() {
    this.elMap.clear();
    this.elements.length = 0;
    this.indexMap.clear();
  }
  private updateIndexMap() {
    const { elements, indexMap } = this;
    const { length } = elements;

    indexMap.clear();
    for (let i = 0; i < length; i++) {
      const element = elements[i];
      const key = this.getKey(element);
      indexMap.set(key, i);
    }
  }
  [Symbol.iterator](): Iterator<T, T, undefined> {
    const elements = [...this.elements];
    return {
      next: () => {
        const p = elements.shift();
        if (p) {
          return {
            done: false,
            value: p,
          } as IteratorYieldResult<T>;
        } else {
          return {
            done: true,
            value: p,
          } as IteratorReturnResult<T>;
        }
      },
    };
  }
  each(handler: createFunction<[T, CollectionKey, this, void]>) {
    this.elMap.forEach((el, k) => handler(el, k, this));
  }
  toArray<M extends Nullable | createFunction<[T, CollectionKey, this, any]>>(
    filter: Nullable | createFunction<[T, CollectionKey, this, boolean]>,
    map: M
  ) {
    const _filter = filter || (() => true);
    const _map = map || ((el) => el);
    let key: CollectionKey;
    return this.elements.reduce((_rr, el) => {
      key = this.getKey(el);
      return _filter(el, key, this)
        ? (_rr.push(_map(el, key, this)), _rr)
        : _rr;
    }, [] as (M extends (...args: any[]) => infer TR ? TR : T)[]);
  }
}
