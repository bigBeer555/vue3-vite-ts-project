<script setup lang="ts">
import type { AlertProps } from './types'

const props = defineProps<AlertProps & { opened: boolean }>()
const emits = defineEmits(['update:opened'])

const closeModal = () => {
  props.opened = false
}
</script>

<template>
  <div class="read-the-docs" :style="{ display: opened ? 'block' : 'none' }">
    <p>{{ title }}</p>
    <p>{{ message }}</p>
    <el-button type="primary" @click="closeModal">确定</el-button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: #fff;
}
</style>
