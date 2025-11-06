import { defineStore } from "pinia"
// 第一种写法（对象式）ps: 第二个参数用对象的写法
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '索菲亚',
    age: 6,
  }),
  actions: {
    incrementAge() {
      this.age++
    }
  }
})
