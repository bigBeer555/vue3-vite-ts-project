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
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const rsleep = (min: number, max: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, Math.random() * (max - min) + min)
  })
}

export enum TaskPriority {
  /**
   * 最高优先级 - 立即执行
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
   * 最低优先级 - 空闲时执行
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
      pending: this.tasks.filter(task => task.state === TaskState.Pending).length,
      running: this.tasks.filter(task => task.state === TaskState.Running).length
    }
  }

  /**
   * 添加任务
   */
  addTask = <T = unknown>(
    execute: Task<T>['execute'],
    options?: Partial<TaskOptions>
  ) => {
    const {
      priority = TaskQueueManager.defaultPriority,
      retryCount = TaskQueueManager.defaultRetryCount,
      retryDelay = TaskQueueManager.defaultRetryDelay,
      ...taskOptions
    } = options ?? {}
    const task = {
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
    this.tasks.push(task)
    this.notify()
  }

  /**
   * 通知队列处理任务
   */
  notify = () => {
    // 任务排序
    this.tasks.sort((prevTask, nextTask) => {
      return prevTask.options.priority - nextTask.options.priority
    })
    TaskQueueManager.state = TaskQueueState.Running
    // 处理任务
    this.processTask()
  }

  /**
   * 处理任务
   */
  processTask = (retryTask?: Task) => {
    if (this.tasks.length === 0) return
    if (this.runningCount >= TaskQueueManager.defaultConcurrency) return
    const task = retryTask || this.tasks.find(t => t.state === TaskState.Pending)
    if (task) {
      TaskQueueManager.print(task.options.description ?? `开始执行任务 ${task.id}`, task.options.name)
      this.runningCount ++
      task.state = TaskState.Running
      task.startedAt = Date.now()
      task.execute()
        .then(
          (result) => {
            this.runningCount --
            task.state = TaskState.Completed
            task.result = result
            task.options.onSuccess?.(result)
            this.tasks = this.tasks.filter(t => t.id !== task.id)
            TaskQueueManager.print(`任务执行完成：${task.options.description}`, task.options.name)
            this.tasks.length > 0 && this.processTask()
          }
        )
        .catch(
          (error) => {
            if (task.retryCount >= task.options.retryCount) {
              task.state = TaskState.Failed
              task.error = error as Error
              task.options.onError?.(error as Error)
              return
            }
            task.retryCount ++
            this.processTask(task)
          }
        )
        .finally(() => {
          task.completedAt = Date.now()
          task.options.onComplete?.()
        })
    }
  }
}

/**
 * 全局任务队列实例
 */
export const taskQueue = new TaskQueueManager()

TaskQueueManager.defaultEnableLog = true

taskQueue.addTask(
  () => sleep(500),
  {
    name: 'Sleep',
    description: '睡眠500毫秒'
  }
)

taskQueue.addTask(
  () => sleep(400),
  {
    name: 'Sleep',
    description: '睡眠400毫秒'
  }
)

taskQueue.addTask(
  () => sleep(300),
  {
    name: 'Sleep',
    description: '睡眠300毫秒'
  }
)

taskQueue.addTask(
  () => sleep(200),
  {
    name: 'Sleep',
    description: '睡眠200毫秒'
  }
)

taskQueue.addTask(
  () => preloadImage('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'),
  {
    priority: TaskPriority.Urgent,
    name: 'PreloadImage',
    description: '预加载一张百度的Logo'
  }
)
