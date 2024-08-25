import { Event } from "../Event";
import { assert } from "../assert";

export type CollectionEvent = {};

export type CollectionKey = string | number;

export type CollectionGetKey<T = any> = (data: T) => CollectionKey;

export class Collection<T = any> extends Event<CollectionEvent> {
  declare getKey: CollectionGetKey<T>;

  constructor(getKey?: CollectionGetKey<T>) {
    super();
    assert(getKey);
    this.getKey = getKey;
  }
}
