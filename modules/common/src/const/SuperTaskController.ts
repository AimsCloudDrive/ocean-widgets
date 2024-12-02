export type SuperTaskControllerOption = {
  accompanyingCount?: number;
};
type _Task = {
  resolve: (data: any) => void;
  reject: (error: any) => void;
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
  addTask<T>(task: () => T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
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
