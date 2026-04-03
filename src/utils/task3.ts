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
   * 当前正在执行的任务数量
   */
  private runningCount = 0
  static defaultRetryCount = 3
  static defaultRetryDelay = 1000
  static defaultPriority = TaskPriority.Normal
  static defaultEnableLog = false
  static defaultConcurrency = 3

  private print = (message: unknown, name?: string) => {
    if (TaskQueueManager.defaultEnableLog) {
      console.log(`[${name}]`, message)
    }
  }

  // 添加任务
  private pushTask = (task: Task) => {
    this.tasks.push(task)
    this._bubbleUp(this.tasks.length - 1)
  }

  private _bubbleUp = (index: number) => {
    if (index === 0) return

    const parent = Math.floor((index - 1) / 2)
    const currentTask = this.tasks[index]
    const parentTask = this.tasks[parent]
    if (!currentTask || !parentTask) return

    if (
      currentTask.options.priority < parentTask.options.priority
    ) {
      ;[this.tasks[index], this.tasks[parent]] = [
        parentTask,
        currentTask
      ]
      this._bubbleUp(parent)
    }
  }

  // 提取任务
  private popTask = () => {
    const tasks = this.tasks
    if (tasks.length === 1) return tasks.pop()
    if (tasks.length === 0) return

    const top = tasks[0]
    const last = tasks.pop()
    if (!top || !last) return top || last
    tasks[0] = last
    this._sinkDown(0)
    return top
  }

  private _sinkDown = (index: number) => {
    const tasks = this.tasks
    const length = tasks.length
    const left = index * 2 + 1
    const right = index * 2 + 2

    let smallest = index

    if (
      left < length &&
      tasks[left] &&
      tasks[smallest] &&
      tasks[left]!.options.priority < tasks[smallest]!.options.priority
    ) {
      smallest = left
    }
    if (
      right < length &&
      tasks[right] &&
      tasks[smallest] &&
      tasks[right]!.options.priority < tasks[smallest]!.options.priority
    ) {
      smallest = right
    }

    if (smallest !== index) {
      const a = tasks[index]
      const b = tasks[smallest]
      if (!a || !b) return
      ;[tasks[index], tasks[smallest]] = [
        b,
        a
      ]
      this._sinkDown(smallest)
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
      this.pushTask(task)
    }
    this.print(this.tasks, '任务队列更新')
    // 处理任务
    this.processTask()
  }

  private getTaskTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  /**
   * 处理任务
   */
  private processTask = () => {
    if (this.tasks.length === 0) return
    const task = this.popTask()
    if (!task) return
    // 非最高级别任务并发数量达到限制则等待任务执行完毕后再进行下一次的任务处理
    const isLimited =
      task.options.priority !== TaskPriority.Urgent &&
      this.runningCount >= TaskQueueManager.defaultConcurrency
    const isIdleLimited =
      task.options.priority === TaskPriority.Idle && this.runningCount > 0
    if (isLimited || isIdleLimited) {
      // 如果任务没有取消则将任务重新放回队列
      !task.cancelled && this.pushTask(task)
      return
    }
    this.runningCount++
    task.state = TaskState.Running
    task.startedAt = Date.now()
    // 显示格式 YYYY-MM-DD HH:mm:ss
    const time = this.getTaskTime(task.startedAt)
    this.print(task, `任务开始 ${time}`)
    // 如果是最低级任务则等待浏览器具备空闲时间后执行
    if (task.options.priority === TaskPriority.Idle) {
      requestIdleCallback((deadline) => {
        if (deadline.timeRemaining() > 0) {
          this.executeTask(task)
        }
      })
    } else {
      this.executeTask(task)
    }
    this.processTask()
  }

  /**
   * 执行任务
   */
  private executeTask = (task: Task) => {
    task
      .execute()
      .then((result) => {
        task.state = TaskState.Completed
        task.completedAt = Date.now()
        this.runningCount--
        const time = this.getTaskTime(task.completedAt)
        this.print(task, `完成任务 ${time}`)
        task.options.onSuccess?.(result)
        this.processTask()
      })
      .catch((error) => {
        // 判断是否需要重试
        if (task.retryCount < task.options.retryCount - 1) {
          task.retryCount++
          this.pushTask(task)
        } else {
          task.state = TaskState.Failed
          task.completedAt = Date.now()
          this.print(task, '任务失败')
          task.options.onError?.(error)
        }
        this.runningCount--
        this.processTask()
      })
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
