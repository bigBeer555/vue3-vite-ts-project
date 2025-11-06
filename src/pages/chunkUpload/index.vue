<template>
  <!-- <img :src="exampleImage" alt="示例图片"></img> -->
     <!-- <img :src="bgImgSrc" alt="示例图片"></img> -->
      <video 
        controls 
        width="400" 
        height="300"
        preload="metadata"
        style="border-radius: 8px;"
      >
        <source src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" type="video/mp4">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
      </video>
  <el-upload
    class="avatar-uploader"
    action="/upload/chunk"
    :show-file-list="false"
    :auto-upload="true"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :before-upload="beforeAvatarUpload"
    :http-request="customHttpRequest"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="无法加载" />
    <div v-else class="avatar-uploader-icon">
      <el-icon><Plus /></el-icon>
      <p>点击上传</p>
    </div>
  </el-upload>
  <el-button type="primary" @click="getFiles('report.pdf')">获取文件</el-button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import request from "../../utils/request";
import exampleImage from "@/assets/img/lg01.webp";
import bgImgSrc from "@/pages/static/img/lg01.webp";

import type { UploadProps } from "element-plus";
const imageUrl = ref("");

onMounted(() => {
  console.log(bgImgSrc, 'bgImgSrc');
  // 图片预加载
  const img = new Image();
  img.src = bgImgSrc;
  img.onload = () => {
    console.log('图片加载完成');
  };

  import('@/pages/login/index.vue').then((module) => {
    console.log(module, 'module');
  })
})

const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  ElMessage.success("上传成功！");
};

const handleAvatarError: UploadProps["onError"] = () => {
  ElMessage.error("上传失败，请重试！");
};

const customHttpRequest = async ({file}:{file:any}) => {
  const chunkSize = 2 * 1024 * 1024; // 每片 2MB
  const totalChunks = Math.ceil(file.size / chunkSize);
  

  for (let i = 0; i < totalChunks; i++) {
    console.log(`当前循环次数: ${i + 1}`, `预期分片数: ${totalChunks}`);
    try {
      console.log(`开始上传分片 ${i + 1}/${totalChunks}`);
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`分片 ${i + 1} 信息: start=${start}, end=${end}, size=${chunk.size}`);
      
      const form = new FormData();
      form.append('chunk', chunk);
      form.append('chunkIndex', i.toString());
      form.append('totalChunks', totalChunks.toString());
      form.append('filename', file.name);
      
      const response = await request({
        url: '/upload/chunk',
        method: 'POST',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const result = response.data;
    } catch (error) {
      console.log(error,'errorerrorerror')
      console.error(`分片 ${i + 1}/${totalChunks} 上传失败:`, error);
      ElMessage.error(`分片 ${i + 1} 上传失败: ${error}`);
      // 继续上传下一个分片，而不是中断整个过程
    }
  }
  
  console.log('所有分片上传完成');
};

const getFiles = async (filename: string) => {
  try {
    const response = await request({
      url: '/upload/info/' + filename,
      method: 'GET',
    });
    console.log('获取文件列表成功:', response.data);
  } catch (error) {
    console.error('获取文件列表失败:', error);
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  color: #8c939d;
  width: 178px;
  height: 178px;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  border: 1px solid #d7d7dc;
  cursor: pointer;
  pointer-events: auto;
}
</style>