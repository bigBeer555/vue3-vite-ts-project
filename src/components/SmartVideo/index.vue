<template>
  <div>
    <video ref="videoRef" controls width="400"></video>
    <button @click="loadVideo">播放视频（带进度）</button>
    <div v-if="progress >= 0">下载进度: {{ progress }}%</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const videoRef = ref(null)
const progress = ref(-1)
const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4?token=9d2f8b10d41e486b85a7ff4e78a99b62&expires=1893475200&user=demo_user_id_1234567890_long_path_example/video_assets/movies/BigBuckBunny720p_full_quality_with_audio_and_subtitles.mp4'

async function loadVideo() {
  // 浏览器的 Cache API 创建缓存对象
  const cacheName = 'video-cache-v1'
  const cache = await caches.open(cacheName)

  let response = await cache.match(videoUrl)

  if (!response) {
    console.log('缓存中没有，开始从网络请求...')

    // 分块读取响应体数据
    const res = await fetch(videoUrl)
    const reader = res.body.getReader()
    const contentLength = +res.headers.get('Content-Length') || 0
    let received = 0
    const chunks = []

    // 边读取视频流并计算下载进度
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      progress.value = Math.floor((received / contentLength) * 100)
    }

    // 合并 Uint8Array
    const blob = new Blob(chunks)
    response = new Response(blob)
    await cache.put(videoUrl, response.clone())
    console.log('视频缓存完成 ✅')
  } else {
    console.log('从缓存中读取视频 ✅')
  }

  const blob = await response.blob()
  videoRef.value.src = URL.createObjectURL(blob)
}
</script>