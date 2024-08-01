export const OBSERVERMATHOD: {
  /**
   * 读取响应式数据时，运行这个函数
   * 将其 取消响应函数的方法——需要传递相同函数作为参数 作为参数传递进来
   * 并返回需要响应运行的函数
   */
  getRunningFunction?:
    | ((cancel: (handle: () => void) => void) => () => void)
    | null;
} = Object.create(null);
