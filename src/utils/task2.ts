export const preloadImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve(null)
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const rsleep = (min: number, max: number) => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(null)
      },
      Math.random() * (max - min) + min
    )
  })
}

export enum TaskPriority {
  /**
   * 最高优先级 - 不受并发限制，立即执行
   */
  Urgent = 0,
  /**
   * 高优先级
   */
  High = 1,
  /**
   * 普通优先级（默认）
   */
  Normal = 2,
  /**
   * 低优先级
   */
  Low = 3,
  /**
   * 最低优先级 - 不受并发限制，仅在空闲时逐个执行
   */
  Idle = 4
}

export interface TaskOptions {
  /**
   * 任务名称
   */
  name?: string
  /**
   * 任务描述
   */
  description?: string
  /**
   * 优先级（默认 Normal）
   */
  priority: TaskPriority
  /**
   * 重试次数（默认使用全局配置）
   */
  retryCount: number
  /**
   * 重试延迟（毫秒，默认使用全局配置）
   */
  retryDelay: number
  /**
   * 任务成功回调
   */
  onSuccess?: (result: unknown) => void
  /**
   * 任务失败回调
   */
  onError?: (error: Error) => void
  /**
   * 任务完成回调（无论成功失败）
   */
  onComplete?: () => void
}

export interface Task<T = unknown> {
  id: string
  state: TaskState
  execute: () => Promise<T>
  options: TaskOptions
  result?: T
  error?: Error
  retryCount: number
  createdAt: number
  startedAt?: number
  completedAt?: number
  /**
   * 任务取消标志
   */
  cancelled: boolean
}

export enum TaskQueueState {
  /**
   * 休眠
   */
  Sleeping,
  /**
   * 运行
   */
  Running
}

export enum TaskState {
  /**
   * 等待
   */
  Pending,
  /**
   * 运行
   */
  Running,
  /**
   * 完成
   */
  Completed,
  /**
   * 失败
   */
  Failed
}

/**
 * 任务队列统计
 */
export interface TaskQueueStats {
  total: number
  pending: number
  running: number
}

/**
 * 高级任务队列管理器
 */
class TaskQueueManager {
  private tasks: Task[] = []
  private taskId = 0
  /**
   * \当前正在执行的任务数量
   */
  private runningCount = 0
  static defaultRetryCount = 3
  static defaultRetryDelay = 1000
  static defaultPriority = TaskPriority.Normal
  static defaultEnableLog = false
  static defaultConcurrency = 3
  private static state = TaskQueueState.Sleeping
  private static print = (message: string, name?: string) => {
    if (TaskQueueManager.defaultEnableLog) {
      console.log(`[${name}] ${message}`)
    }
  }

  get stats(): TaskQueueStats {
    return {
      total: this.tasks.length,
      pending: this.tasks.filter((task) => task.state === TaskState.Pending)
        .length,
      running: this.tasks.filter((task) => task.state === TaskState.Running)
        .length
    }
  }

  // 添加任务
  private pushTask = (task: Task) => {
    this.tasks.push(task)
    this._bubbleUp(this.tasks.length - 1)
  }

  private _bubbleUp = (index: number) => {
    const parentIndex = Math.floor((index - 1) / 2)
    const current = this.tasks[index]
    const parent = this.tasks[parentIndex]
    if (!current || !parent) return
    if (parentIndex >= 0 && current.options.priority < parent.options.priority) {
      ;[this.tasks[index], this.tasks[parentIndex]] = [parent, current]
      this._bubbleUp(parentIndex)
    }
  }

  // 提取任务
  private popTask = (): Task | undefined => {
    const task = this.tasks[0]
    if (!task) return
    const lastTask = this.tasks.pop()
    if (lastTask && this.tasks.length > 0) {
      this.tasks[0] = lastTask
      this._sinkDown(0)
    }
    return task
  }

  private _sinkDown = (index: number) => {
    const leftChildIndex = 2 * index + 1
    const rightChildIndex = 2 * index + 2
    let smallestIndex = index
    const current = this.tasks[index]
    if (!current) return
    const smallest = this.tasks[smallestIndex]
    if (!smallest) return
    const left = this.tasks[leftChildIndex]
    const right = this.tasks[rightChildIndex]
    if (leftChildIndex < this.tasks.length && left && left.options.priority < smallest.options.priority) {
      smallestIndex = leftChildIndex
    }
    const smallest2 = this.tasks[smallestIndex]
    if (!smallest2) return
    if (rightChildIndex < this.tasks.length && right && right.options.priority < smallest2.options.priority) {
      smallestIndex = rightChildIndex
    }
    if (smallestIndex !== index) {
      const a = this.tasks[index]
      const b = this.tasks[smallestIndex]
      if (!a || !b) return
      ;[this.tasks[index], this.tasks[smallestIndex]] = [b, a]
      this._sinkDown(smallestIndex)
    }
  }

  addTasks = (
    tasks: Array<{
      execute: Task['execute']
      options?: Partial<TaskOptions>
    }>
  ) => {
    for (const { execute, options } of tasks) {
      const {
        priority = TaskQueueManager.defaultPriority,
        retryCount = TaskQueueManager.defaultRetryCount,
        retryDelay = TaskQueueManager.defaultRetryDelay,
        ...taskOptions
      } = options ?? {}
      const  task = {
        id: `${++this.taskId}`.padStart(6, '0'),
        state: TaskState.Pending,
        execute,
        options: {
          priority,
          retryCount,
          retryDelay,
          ...taskOptions
        },
        retryCount: 0,
        createdAt: Date.now(),
        cancelled: false
      }
      this.pushTask(task)
    }
    // 处理任务
    this.processTask()
  }

  /**
   * 处理任务
   */
  processTask = () => {
    if (this.tasks.length === 0) return
    const task = this.popTask()
    if (!task) return
    // 非最高级别任务
    if (task.options.priority !== TaskPriority.Urgent && this.runningCount >= TaskQueueManager.defaultConcurrency) return
    this.runningCount ++
    task.state = TaskState.Running
    task.startedAt = Date.now()
  }
}

/**
 * 全局任务队列实例
 */
export const taskQueue = new TaskQueueManager()

TaskQueueManager.defaultEnableLog = true

taskQueue.addTasks([
  {
    execute: () => sleep(200).then(Promise.reject),
    options: {
      name: 'Sleep',
      description: '睡眠200毫秒'
    }
  },
  {
    execute: () => sleep(300),
    options: {
      name: 'Sleep',
      description: '睡眠300毫秒'
    }
  },
  {
    execute: () => sleep(400),
    options: {
      name: 'Sleep',
      description: '睡眠400毫秒'
    }
  },
  {
    execute: () => sleep(500),
    options: {
      name: 'Sleep',
      description: '睡眠500毫秒'
    }
  },
  {
    execute: () =>
      preloadImage(
        'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
      ),
    options: {
      priority: TaskPriority.Urgent,
      name: 'PreloadImage',
      description: '预加载一张百度的Logo'
    }
  }
])
