type Task = () =>  Promise<unknown>
/**
 * @param concurrency 并发数
 * @param running 正在执行任务数量
 * @param tasks 任务队列
 * @description 任务并行执行
 */

class ConcurrentTaskQueue {
  private tasks: Array<Task> = []
  private running = 0
  /**
   * 并发数
   */
  private concurrency = 1

  /**
   * 执行任务
   */
  add(task: Task) {
    this.tasks.push(task)
    this.next()
  }

  /**
   * 执行下一个任务
   */
  next() {
    while (this.running < this.concurrency && this.tasks.length) {
      const task = this.tasks.shift()
      console.log(this.tasks,'this.tasksthis.tasks')
      if (!task) return
      this.running++
      task?.().finally(() => {
        this.running--
        this.next()
      })
    }
  }
}

export const concurrentTaskQueue = new ConcurrentTaskQueue()
