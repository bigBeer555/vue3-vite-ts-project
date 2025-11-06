export function debounce(fn: Function, wait: number) {
  return function (...args:any[]) {
    fn()
  }
}