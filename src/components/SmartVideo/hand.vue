<template>
  <div class="video-player">
    <video
      ref="video"
      controls
      class="w-full"
      style="max-width: 600px;"
    ></video>
    <div v-if="progress < 100">缓存进度：{{ progress.toFixed(1) }}%</div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const progress = ref<number>(0)
  // const videoRef = ref<HTMLVideoElement | null>(null)
  // const videoUrl = ref<string>('')
  // const playVideo = async() => {
  //   const video = videoRef.value
  //   if (!video) return
  //   const cache = await caches.open('video-cache-hand')
  //   const cached = await cache.match(videoUrl.value)
  //   if (cached) {
  //     const blob = await cached.blob()
  //     video.src = URL.createObjectURL(blob)
  //     video.play()
  //     return
  //   }

  //   // 2) 正常网络播放，确保用户体验
  //   video.src = videoUrl.value
  //   try { await video.play() } catch {}

  //   // 3) 后台边缓存：把网络响应体复制到 CacheStorage
  //   try {
  //     const res = await fetch(videoUrl.value)
  //     const reader = res.body?.getReader()
  //     const total = Number(res.headers.get('Content-Length')) || 0
  //     let received = 0
  //     const stream = new ReadableStream({
  //       async start(controller) {
  //         if (!reader) {
  //           await cache.put(videoUrl.value, res.clone())
  //           controller.close()
  //           // 缓存完成后，无缝切换到缓存源并保留进度
  //           const keepTime = video.currentTime
  //           const keepPaused = video.paused
  //           const saved = await cache.match(videoUrl.value)
  //           if (saved) {
  //             const blob = await saved.blob()
  //             const obj = URL.createObjectURL(blob)
  //             video.src = obj
  //             video.currentTime = keepTime
  //             if (!keepPaused) video.play()
  //           }
  //         }
  //       }
  //     })
  //   } catch {}
  // }
</script>

<style scoped>
.video-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>