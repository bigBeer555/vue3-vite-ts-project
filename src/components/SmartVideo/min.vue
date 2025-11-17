<template>
  <video ref="videoRef" controls autoplay muted style="width:100%"></video>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ src: string }>()
const emit = defineEmits<{
  (e: 'cache-progress', percent: number): void
  (e: 'cache-complete'): void
  (e: 'switched-to-cache'): void
}>()
const videoRef = ref<HTMLVideoElement | null>(null)

onMounted(async () => {
  const url = props.src
  const video = videoRef.value!

  // 1) 先尝试从缓存播放，保证离线也能播
  const cache = await caches.open('video-stream-cache')
  const cached = await cache.match(url)
  if (cached) {
    const blob = await cached.blob()
    video.src = URL.createObjectURL(blob)
    try { await video.play() } catch {}
    return
  }

  // 2) 正常网络播放，确保用户体验
  video.src = url
  try { await video.play() } catch {}

  // 3) 后台边缓存：把网络响应体复制到 CacheStorage
  try {
    const res = await fetch(url)
    const reader = res.body?.getReader()
    const total = Number(res.headers.get('Content-Length')) || 0
    let received = 0
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          await cache.put(url, res.clone())
          controller.close()
          emit('cache-complete')
          // 缓存完成后，无缝切换到缓存源并保留进度
          const keepTime = video.currentTime
          const keepPaused = video.paused
          const saved = await cache.match(url)
          if (saved) {
            const blob = await saved.blob()
            video.src = URL.createObjectURL(blob)
            try { video.currentTime = keepTime } catch {}
            if (!keepPaused) {
              try { await video.play() } catch {}
            }
            emit('switched-to-cache')
          }
          return
        }
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
          received += value.length
          if (total > 0) {
            emit('cache-progress', Math.floor((received / total) * 100))
          }
        }
        controller.close()
      }
    })
    await cache.put(url, new Response(stream, { headers: { 'Content-Type': 'video/mp4' } }))
    emit('cache-complete')
    // 缓存完成后，无缝切换到缓存源并保留进度
    const keepTime = video.currentTime
    const keepPaused = video.paused
    const saved = await cache.match(url)
    if (saved) {
      const blob = await saved.blob()
      video.src = URL.createObjectURL(blob)
      try { video.currentTime = keepTime } catch {}
      if (!keepPaused) {
        try { await video.play() } catch {}
      }
      emit('switched-to-cache')
    }
  } catch (e) {
    console.warn('[SmartVideo:min] 缓存失败（忽略以保证播放）', e)
  }
})
</script>

<style scoped>
/* 最小化样式，按需调整 */
</style>