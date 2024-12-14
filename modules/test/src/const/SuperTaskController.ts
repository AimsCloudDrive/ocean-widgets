import { OcPromise, Reject, Resolve } from "../promise";

export type SuperTaskControllerOption = {
  accompanyingCount?: number;
};
type _Task = {
  resolve: Resolve;
  reject: Reject;
  task: () => any;
};

export class SuperTaskController {
  private declare tasks: _Task[];
  private declare accompanyingCount: number;
  private declare runningCount: number;

  constructor(option?: SuperTaskControllerOption) {
    option = option || {};
    this.accompanyingCount = Number(option.accompanyingCount) || 2;
    this.tasks = [];
    this.runningCount = 0;
  }
  addTask<T>(task: () => T): OcPromise<T> {
    return new OcPromise<T>((resolve, reject) => {
      this.tasks.push({
        task,
        resolve,
        reject,
      });
      this.run();
    });
  }
  private run() {
    while (
      this.runningCount <= this.accompanyingCount &&
      this.tasks.length > 0
    ) {
      const { task, resolve, reject } = this.tasks.shift()!;
      this.runningCount++;
      new Promise((resolve) => resolve(task()))
        .then(resolve, reject)
        .finally(() => {
          this.runningCount--;
          this.run();
        });
    }
  }
}
