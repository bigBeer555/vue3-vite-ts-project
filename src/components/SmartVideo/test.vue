<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- <h1 class="text-2xl font-bold mb-6 text-center">🎬 视频预加载性能对比演示（带进度条）</h1> -->

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 普通视频 -->
      <div class="p-4 bg-white rounded-2xl shadow">
        <!-- <h2 class="text-lg font-semibold mb-2 text-center text-gray-700">❌ 普通加载</h2> -->
        <div class="relative">
          <video
          width="200"
          height="200"
            ref="normalVideo"
            class="w-full rounded-xl shadow"
            controls
            preload="metadata"
          />
          <div v-if="!normalLoaded" class="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
            加载中...
          </div>
        </div>
        <div class="mt-3">
          <p class="text-center text-sm text-gray-500">
            加载耗时：{{ normalLoadTime ? normalLoadTime + ' ms' : '加载中...' }}
          </p>
        </div>
      </div>

      <!-- 智能预加载 -->
      <div class="p-4 bg-white rounded-2xl shadow relative">
        <h2 class="text-lg font-semibold mb-2 text-center text-green-600">✅ 智能预加载</h2>

        <div class="relative">
          <video
          width="200"
          height="200"
            ref="smartVideo"
            class="smart-video w-full rounded-xl shadow"
            controls
            preload="metadata"
          />
          <div v-if="!smartLoaded" class="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
            {{ preloadStatus }}
          </div>
          <!-- 进度条 -->
          <div v-if="isPreloading" class="absolute bottom-0 left-0 h-1 bg-green-400" :style="{ width: preloadProgress + '%' }"></div>
        </div>

        <p class="mt-3 text-center text-sm text-gray-500">
          加载耗时：{{ smartLoadTime ? smartLoadTime + ' ms' : '等待缓存中...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 🔗 一个较大的测试视频
const videoUrl =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4?token=9d2f8b10d41e486b85a7ff4e78a99b62&expires=1893475200&user=demo_user_id_1234567890_long_path_example/video_assets/movies/BigBuckBunny720p_full_quality_with_audio_and_subtitles.mp4'

// 普通视频状态
const normalVideo = ref(null)
const normalLoadTime = ref(0)
const normalLoaded = ref(false)

// 智能视频状态
const smartVideo = ref(null)
const smartLoadTime = ref(0)
const smartLoaded = ref(false)
const preloadStatus = ref('等待空闲加载...')
const isPreloading = ref(false)
const preloadProgress = ref(0)

onMounted(async () => {
  // ===== 普通加载时间测量 =====
  const startNormal = performance.now()
  normalVideo.value.src = videoUrl
  normalVideo.value.addEventListener('loadeddata', () => {
    normalLoaded.value = true
    normalLoadTime.value = Math.round(performance.now() - startNormal)
  })

  // ===== 智能预加载逻辑 =====
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preloadVideo(videoUrl))
  } else {
    setTimeout(() => preloadVideo(videoUrl), 2000)
  }
})

// ===== 预加载函数 =====
async function preloadVideo(url) {
  try {
    preloadStatus.value = '开始缓存视频...'
    isPreloading.value = true
    const cache = await caches.open('video-cache')
    const cached = await cache.match(url)

    if (cached) {
      preloadStatus.value = '已存在缓存，准备播放...'
      return loadFromCache(url)
    }

    const res = await fetch(url)
    const reader = res.body.getReader()
    const contentLength = +res.headers.get('Content-Length')
    let receivedLength = 0
    let chunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      receivedLength += value.length
      preloadProgress.value = Math.round((receivedLength / contentLength) * 100)
      preloadStatus.value = `正在缓存：${preloadProgress.value}%`
    }

    const blob = new Blob(chunks)
    await cache.put(url, new Response(blob))
    preloadStatus.value = '缓存完成 ✅'
    isPreloading.value = false

    loadFromCache(url)
  } catch (e) {
    preloadStatus.value = '缓存失败 ❌'
    isPreloading.value = false
    console.error('[SmartVideoDemo] 缓存失败:', e)
  }
}

// ===== 从缓存加载视频 =====
async function loadFromCache(url) {
  const cache = await caches.open('video-cache')
  const cached = await cache.match(url)
  if (cached) {
    const blob = await cached.blob()
    smartVideo.value.src = URL.createObjectURL(blob)

    const startSmart = performance.now()
    smartVideo.value.addEventListener('loadeddata', () => {
      smartLoaded.value = true
      smartLoadTime.value = Math.round(performance.now() - startSmart)
      preloadStatus.value = '播放就绪 ✅'
    })
  }
}
</script>

<style scoped>
video {
  background-color: #000;
  max-height: 300px;
  object-fit: cover;
}
</style>