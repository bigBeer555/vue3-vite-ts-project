<template>
  <MinSmartVideo :src="videoUrl" />
</template>

<script setup lang="ts">
import MinSmartVideo from './min.vue'

// 示例视频地址，可替换为你的实际地址
const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
</script>

<style scoped>
/* 使用最小版组件，无需额外样式 */
</style>