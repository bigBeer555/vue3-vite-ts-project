<template>
  <div>
    <video width="400" controls ref="videoRef"></video>
    <ElButton type="primary" @click="handlePlay">播放并缓存 ({{ progress }}%)</ElButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const progress = ref<number>(0)

const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const handlePlay = async () => {
  const cache = await caches.open('video-stream-cache')
  const cacheKey = videoUrl

  // 检查缓存是否已有视频
  const cached = await cache.match(cacheKey)
  if (cached) {
    console.log('从缓存播放 ✅')
    const blob = await cached.blob()
    videoRef.value!.src = URL.createObjectURL(blob)
    videoRef.value!.play()
    return
  }

  console.log('开始边播边缓存...')
  const response = await fetch(videoUrl)

  // 获取可读流
  const reader = response.body?.getReader()
  const contentLength = Number(response.headers.get('Content-Length')) || 0
  let received = 0

  // 用于缓存的流副本
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        controller.enqueue(value)
        received += value.length
        progress.value = Math.floor((received / contentLength) * 100)
      }
      controller.close()
      console.log('缓存流读取完毕 ✅')
    }
  })

  // 用流生成 Response，一边播放一边缓存
  const responseForCache = new Response(stream, {
    headers: { 'Content-Type': 'video/mp4' }
  })

  // 把一份复制的流交给 video 播放
  const responseForVideo = response.clone()
  videoRef.value!.src = URL.createObjectURL(await responseForVideo.blob())
  videoRef.value!.play()

  // 把流存入浏览器 Cache
  cache.put(cacheKey, responseForCache)
}
</script>