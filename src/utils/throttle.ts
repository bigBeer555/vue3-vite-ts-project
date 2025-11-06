// throttle.ts
export function throttle(fn: Function, wait: number) {
  let timeout: number | null = null;
  let lastTime: number = 0;
  console.log(lastTime,'lastTime')
  return (...args: any[]) => {
    const now = Date.now();
    const remainingTime = wait - (now - lastTime);
    console.log(remainingTime,'remainingTime')
    if (remainingTime <= 0) {
      // 久
      // 如果时间间隔大于设定的等待时间，则立即执行函数
      console.log(111111)
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timeout) {
      console.log(222222)
      // 近
      // 如果时间间隔小于设定的等待时间，则设置一个新的定时器
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        fn(...args);
      }, remainingTime);
    }
  };
}