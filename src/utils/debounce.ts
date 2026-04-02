/**
 * 防抖函数
 * 
 * @param fn 要执行的函数
 * @param wait 等待时间，默认1000ms
 * @returns 一个新的函数，该函数在等待时间内没有被调用时，才会执行fn函数
 */
export function debounce(fn: Function, wait: number = 1000) {
  let timeout: number | null = null
  return function (...args:any[]) {
    if(timeout) {
      clearTimeout(timeout)
      // timeout = null
    }
    timeout = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}


// export function debounce(fn: Function, wait: number = 1000) {
//   let timeout: any = null
//   return function (this: any, ...args: any[]) {
//     if (timeout) {
//       clearTimeout(timeout)
//     }
//     timeout = setTimeout(() => {
//       fn.apply(this, args)
//     }, wait)
//   }
// }