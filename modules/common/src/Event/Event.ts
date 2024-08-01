export class Event<E extends {} = {}> {
  declare events: {
    [K in keyof E]: ((event: E[K], type: K, self: Event<E>) => void)[];
  };
  constructor() {
    this.events = Object.create(this.events || {});
  }
  on<T extends keyof E>(
    type: T,
    handler: (event: E[T], type: T, self: Event<E>) => void
  ) {
    let handlers = this.events[type];
    if (!handlers) {
      handlers = this.events[type] = [];
    }
    handlers.push(handler);
    return this;
  }
  un<T extends keyof E>(
    type: T,
    handler: (event: E[T], type: T, self: Event<E>) => void
  ) {
    let handlers = this.events[type];
    if (!handlers) {
      return this;
    }
    const index = handlers.findIndex((_handler) => handler === _handler);
    if (index === -1) return this;
    handlers.splice(index, 1);
    return this;
  }
  emit<T extends keyof E>(type: T, event: E[T]) {
    let handlers = this.events[type];
    if (!handlers) {
      return;
    }
    handlers.forEach((handler) => handler(event, type, this));
  }
}
