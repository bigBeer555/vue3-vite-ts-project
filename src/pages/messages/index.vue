<template>
  <div class="messages-container">
    <button @click="onTaskQueue">bingfa</button>
    <input type="text" v-model="inputValue">
    <button @click="onConnect">建立连接</button>
    <button @click="onSend">发送消息</button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
// import { taskQueue } from '../../utils/task';
import { concurrentTaskQueue } from '../../utils/TaskQueue';
import { eventBus } from '../../utils/evenBus';
import request from '../../utils/request';

const ws = ref<WebSocket | null>(null)
const inputValue = ref('')
const HEARTBEAT_INTERVAL = 2000
const HEARTBEAT_TIMEOUT = 1000
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null

// 测试并发任务队列
const onTaskQueue = () => {
  eventBus.openPreview(true)
  const taskRequestUrlList = ['/test/1', '/test/2', '/test/3']
    taskRequestUrlList.forEach(url => {
      // taskQueue.add(() => request(url))
      concurrentTaskQueue.add(() => request(url))
    })
}

// 建立连接
const onConnect = () => {
  if (ws.value) return
  ws.value = new WebSocket('ws://localhost:8080')
}

// 发送消息
const onSend = () => {
  if (!ws.value) return
  ws.value.send(inputValue.value)
}



// 页面卸载前关闭连接并清理心跳资源
onBeforeUnmount(() => {
  // clearHeartbeat()
  // if (ws.value && ws.value.readyState === WebSocket.OPEN) {
  //   ws.value.close()
  // }
})
</script>

<style lang="scss" scoped>

</style>
