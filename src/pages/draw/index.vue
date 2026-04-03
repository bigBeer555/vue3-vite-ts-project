<template>
  <div class="container">
<!-- 1.水浪进度条 -->
<!-- <div class="spin-bg">
  <div class="spin" :style="{top: rotateNum + 'px'}">
</div>
</div>
<el-button @click="rotateNum = rotateNum + 10">进度-10</el-button> -->


  <!-- 2.预加载视频 -->
  <!-- <SmartVideo width="600" height="300" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4?token=9d2f8b10d41e486b85a7ff4e78a99b62&expires=1893475200&user=demo_user_id_1234567890_long_path_example/video_assets/movies/BigBuckBunny720p_full_quality_with_audio_and_subtitles.mp4" /> -->
  <!-- <HandVideo></HandVideo> -->
   <!-- <flowVideo></flowVideo> -->


   <!-- 3.全局弹窗 -->
  <!-- <el-button @click="showModal">展示</el-button> -->
  <!-- <el-button @click="closeModal">关闭</el-button> -->


  <!-- 4.刮刮乐 -->
  <Ccrape />


  <!-- 5.刮奖 -->
   <!-- <div class="draw-tools">
    <div class="draw-tools-item">
      <el-button @click="clearCanvas">清除</el-button>
      <el-input type="number" v-model="lineWidth" placeholder="请输入线宽" style="width: 100px;"></el-input>
    </div>
    <div class="draw-color">
      <el-button v-for="c in lineColorOptions" :style="{backgroundColor: c,border: `1px solid ${c}`,marginLeft: '4px' }" @click="lineColor = c"></el-button>
    </div>
  </div>
  <div class="canvas-container"></div>
  <div class="ignore-draw-container">
    <canvas 
      ref="canvasRef"
      width="600"
      height="300"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @touchstart.prevent="handleMouseDown"
      @touchmove.prevent="handleMouseMove"
      @touchend.prevent="handleMouseUp"
      >
      </canvas>
  </div> -->


  <!-- 6.动画 水波进度 -->
   <!-- <div class="animation-box">
   </div> -->

    <!-- 7.动画 左右摇摆 -->
   <!-- <div class="wrapper">
    <div class="inner">🚀</div>
  </div> -->

  <!-- 7.动画 悬挂气球 -->
    <div class="hang">
      <div class="string"></div>
      <div class="balloon"></div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
// import SmartVideo from '@/components/SmartVideo/index.vue'
import HandVideo from '@/components/SmartVideo/hand.vue'
import { DialogType, useDialog } from '@/hooks/dialog'
import flowVideo from '@/components/SmartVideo/flow.vue'
import { ElButton } from 'element-plus';
import Ccrape from '@/components/Ccrape/index.vue'

interface Pos {
  x: number | null;
  y: number | null;
}
const { id, opened } = useDialog(DialogType.Alert, {
  title: '提示',
  appendToBody: false,
  message: '这是一个提示弹窗',
})


const canvasRef = ref<HTMLCanvasElement | null>(null);
const startDraw = ref<boolean>(false);
const lineWidth = ref<number>(5);
const lineColor = ref<string>('black');

const rotateNum = ref<number>(0);

const lineColorOptions = ref<string[]>([
  'black',
  'red',
  'green',
  'blue',
  'yellow',
  'orange',
  'purple',
  'cyan',
  'magenta',
  'brown',
  'gray',
  'white',
])



let ctx: CanvasRenderingContext2D | null = null;
onMounted(() => {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext('2d');

  // 如果按住超出Canvas范围就停止绘画
  canvasRef.value.addEventListener('mouseleave', handleMouseUp)
})



const clearCanvas = () => {
  if (!canvasRef.value || !ctx) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
}

const showModal = () => {
  opened.value = true
}

const closeModal = () => {
  opened.value = false
}

// 相对计算
const getPos = (e: MouseEvent | TouchEvent):Pos|undefined  => {
  if (!canvasRef.value) return;
  const c = canvasRef.value!
  const rect  = c.getBoundingClientRect()

  if (e instanceof MouseEvent) {
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  } else {
    const touch = e.touches[0] || e.changedTouches[0]
    if (!touch) return
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }
}

// 按下
const handleMouseDown = (e: MouseEvent | TouchEvent) => {
  console.log(ctx,'ctx')
  if (!canvasRef.value || !ctx) return;
  startDraw.value = true;
  const pos = getPos(e)
  ctx?.beginPath();
  ctx?.moveTo(pos?.x as number, pos?.y as number);
}

// 移动
const handleMouseMove = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value || !ctx) return;
  if (!startDraw.value) return;
  const pos = getPos(e)

  ctx.strokeStyle = lineColor.value;
  ctx.lineWidth = lineWidth.value;
  ctx?.lineTo(pos?.x as number, pos?.y as number);
  ctx?.stroke();
}

// 松开
const handleMouseUp = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value || !ctx) return;
  // ctx.closePath();
  startDraw.value = false;
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
  }
  .draw-tools {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
  }
  .draw-tools-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .draw-color {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .canvas-container {
    width: 150px;
    height: 100px;
    border: 1px solid #000;
  }
  .ignore-draw-container {
    display:block;
    width:600px;  /* CSS 尺寸（与 canvas 的 width/height 属性同步） */
    height:300px;
    background:white;
    border:1px solid #e2e8f0;
    touch-action: none; /* 阻止触摸滚动，直接用于绘制 */
  }

.spin-bg {
  width: 50px;
  height: 50px;
  /* border: 1px solid #e2e8f0; */
  position: relative;
  border: 100px solid #fff;
  border-radius: 50%;

  display: flex
;
    justify-content: center;
    align-items: center;
}
  .spin {
    background-color: aqua;
    width: 70px;
    height: 70px;
    border-radius: 25px;
  animation: rotate 3s linear infinite;

  position: absolute;
  /* top: 30px; */
  /* left: 0;
  right: 0;
  bottom: 0; */
  z-index:  -1;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}


.animation-box {
  width: 100px;
  height: 100px;
  background-color: red;
  @media (orientation: landscape) {
    width: 200px;
  height: 200px;
  }
}

.animation-box:hover {
  transform-origin: top left;
  background-color: blue;
  /* animation: rotate 2s linear infinite; */
}

.wrapper {
  animation: moveY 4s linear infinite;
}

.inner {
  animation: swingX 1s ease-in-out infinite;
}

@keyframes moveY {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(200px);
  }
}

@keyframes swingX {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(20px); }
  100% { transform: translateX(0); }
}

.hang {
  position: relative;
  width: 60px;
  height: 160px;
  transform-origin: top center;
  animation: swing 3s ease-in-out infinite;
}

/* 绳子 */
.string {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 60px;
  background: #999;
  transform: translateX(-50%);
}

/* 气球 */
.balloon {
  position: absolute;
  top: 60px;
  left: 50%;
  width: 50px;
  height: 65px;
  background: red;
  border-radius: 50% 50% 45% 45%;
  transform: translateX(-50%);
}
@keyframes swing {
  0% { transform: rotate(-45deg); }
  25% { transform: rotate(45deg); }
  50% { transform: rotate(-45deg); }
  75% { transform: rotate(45deg); }
  100% { transform: rotate(-45deg); }
}

</style>