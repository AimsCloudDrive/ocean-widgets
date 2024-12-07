/**
 * 于执行延迟调用，并返回一个取消执行的函数
 * @param task 延迟执行的函数
 * @returns cancel
 */
const nextTickStore = {
  id: 0,
  tickMap: new Map<number, { canceled: boolean }>(),
};

/**
 *
 * @param task
 * @returns
 */
export const nextTick = (task: () => void) => {
  const { id, tickMap } = nextTickStore;
  const option = {
    canceled: false,
  };
  tickMap.set(id, option);
  nextTickStore.id++;
  const _task = () => {
    option.canceled || task();
    tickMap.delete(id);
  };
  if (typeof process !== "undefined" && process.nextTick) {
    // node
    process.nextTick(_task);
  } else if (typeof queueMicrotask !== "undefined") {
    // 浏览器
    queueMicrotask(_task);
  } else if (typeof MutationObserver !== "undefined") {
    // 浏览器
    const ob = new MutationObserver(_task);
    const dom = document.createTextNode(String(id)); // 创建文本节点
    ob.observe(dom, {
      characterData: true,
    });
    dom.data = String(id + 1); // 触发变化
    ob.disconnect();
    dom.remove();
  } else {
    // 浏览器
    setTimeout(_task, 0);
  }
  return id;
};

/**
 *
 * @param id nextTick返回的id
 */
export const cancelNextTick = (id: number) => {
  const { tickMap } = nextTickStore;
  const option = tickMap.get(id);
  if (option) {
    option.canceled = true;
  }
};
