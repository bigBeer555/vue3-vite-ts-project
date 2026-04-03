<template>
  <div class="scratch-container">
    <!-- 奖品内容 -->

    <div class="ignore-prize">🎁 恭喜中奖！
    <!-- 刮刮乐遮罩 -->
      <div class="ignore-scratch-mask">
        <canvas 
        width="200" 
        height="100" 
        ref="canvasRef2" 
        class="scratch-canvas"
        @mousedown="handleScratchStart"
        @mousemove="handleScratch"
        @mouseup="handleScratchEnd"
        @touchstart.prevent="handleScratchStart"
        @touchmove.prevent="handleScratch"
        @touchend.prevent="handleScratchEnd"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
interface Pos {
  x: number | null;
  y: number | null;
}

let ctx: CanvasRenderingContext2D | null = null;
const canvasRef2 = ref<HTMLCanvasElement | null>(null);
const startDraw = ref<boolean>(false);

onMounted(() => {
  if (canvasRef2.value) {
    ctx = canvasRef2.value.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#d9d9d9';
      ctx.fillRect(0, 0, canvasRef2.value.width, canvasRef2.value.height);
      ctx.globalCompositeOperation = 'destination-out'
    }
  }
});

function getPos(e: MouseEvent | TouchEvent):Pos|undefined {
  if (!canvasRef2.value) return;
  const c = canvasRef2.value!
  const rect  = c.getBoundingClientRect()

  if (e instanceof MouseEvent) {
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  } else {
    const touch = e.touches[0] || e.changedTouches[0]
    if (!touch) return
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }
}

function handleScratchStart(e: MouseEvent | TouchEvent) {
  const pos = getPos(e)
  if (!pos || !ctx) return
  startDraw.value = true
  ctx.clearRect(pos.x as number, pos.y as number, 10, 10);
}

function handleScratch(e: MouseEvent | TouchEvent) {
  if (!startDraw.value) return
  const pos = getPos(e)
  if (!pos || !ctx) return
  ctx.fillStyle = 'rgba(1, 1, 1, 0.3)';
  ctx.fillRect(pos.x as number, pos.y as number, 10, 10);
}

function getScratchProgress() {
  if (!ctx || !canvasRef2.value) return 0;
  const { width, height } = canvasRef2.value;
  const imageData = ctx.getImageData(0, 0, width, height);
  console.log(imageData.data,'imageData.dataimageData.data')
  const data = imageData.data
  let transparent = 0;

  for (let i = 3; i < data.length; i += 4) {
    const alpha = data[i]
    if (alpha !== undefined && alpha <= 30) transparent++;
  }

  return (transparent / (width * height)) * 100;
}

function handleScratchEnd() {
  console.log('handleScratchEnd')
  startDraw.value = false
  if (!ctx) return 
  const progress = getScratchProgress()
  if (progress >= 80) {
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(0, 0, canvasRef2.value?.width || 0, canvasRef2.value?.height || 0);
  }
}

</script>

<style scoped>
  .ignore-prize {
    width: 200px;
    height: 100px;
    background-color: #f4f5f5;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .ignore-scratch-mask {
    width: 200px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
  }
</style>
