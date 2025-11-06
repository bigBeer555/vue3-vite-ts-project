<template>
  <div class="container">
    哈喽啊
    <StandardTable />
  </div>
</template>

<script setup lang="ts">
import StandardTable from '@/components/StandardTable/index.vue'
import { useAttrs } from 'vue'

const attrs = useAttrs()
console.log(attrs,'attrs')
</script>

<style scoped>
.container {
    color: red;
}
</style>
