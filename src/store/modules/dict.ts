import { defineStore } from "pinia"
import { ref } from "vue"
// 第二种写法（函数式）  ps: 第二个参数用回调的写法
export const useDictStore = defineStore('dict', () => {
  const label = ref('字典')
  const deleteLabel = () => {
    label.value = ''
  }
  return {
    label,
    deleteLabel,
  }
})
