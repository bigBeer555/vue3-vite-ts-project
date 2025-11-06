<template>
  <div class="container">
    标准表格
  </div>
</template>
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
console.log(attrs,'attrs')
</script>

<style scoped>
.container {
    color: #87ceeb;
}
</style>
