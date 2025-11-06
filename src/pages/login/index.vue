<template>
  <image src="/login-bg.jpg" alt="登录背景" class="login-bg" />
  <div class="login-container">
    <!-- 动态背景 -->
    <div class="background">
      <div class="stars"></div>
      <div class="grid-overlay"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div class="content">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <div class="tech-logo">
            <div class="logo-ring"></div>
            <div class="logo-core"></div>
          </div>
        </div>
        <h1 class="logo-text">TechLogin</h1>
        <p class="subtitle">{{ $t('common.subtitle') }}</p>
      </div>
      
      <!-- 登录表单 -->
      <div class="login-form">
        <div class="form-container">
          <h2 class="form-title">系统登录</h2>
          
          <div class="input-group">
            <div class="input-wrapper">
              <input 
                v-model="loginForm.username" 
                type="text" 
                placeholder="用户名"
                class="tech-input"
                @focus="onInputFocus"
                @blur="onInputBlur"
              >
              <div class="input-border"></div>
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="input-group">
            <div class="input-wrapper">
              <input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="密码"
                class="tech-input"
                @focus="onInputFocus"
                @blur="onInputBlur"
              >
              <div class="input-border"></div>
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              <span class="checkbox-text">记住我</span>
            </label>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
          
          <button class="login-btn" @click="handleLogin">
            <span class="btn-text">登录系统</span>
            <div class="btn-glow"></div>
            <div class="btn-particles">
              <div class="btn-particle" v-for="i in 6" :key="i"></div>
            </div>
          </button>
          
          <div class="divider">
            <span>或者</span>
          </div>
          
          <div class="social-login">
            <button class="social-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button class="social-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button class="social-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="decorative-elements">
      <div class="tech-lines">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
        <div class="line line-3"></div>
      </div>
      <div class="corner-decorations">
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { onUnmounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useDictStore } from '@/store/modules/dict'

const router = useRouter()
// const study = ref<HTMLDivElement>()
const studyRef = useTemplateRef<HTMLDivElement>('study')
const userStore = useUserStore()
const dictStore = useDictStore()

onUnmounted(() => {
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries() as PerformanceEventTiming[];
    const firstInput = entries[0];
    console.log(firstInput,'firstInput')
    if (firstInput) {
      // 计算 FID
      const fidValue = firstInput.processingStart - firstInput.startTime;
      console.log('FID:', fidValue);
    }
  });
  lcpObserver.observe({ type: 'first-input', buffered: true });
})

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

const rememberMe = ref(false)

// 粒子动画样式
const getParticleStyle = (index: number) => {
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const size = 2 + Math.random() * 4
  const x = Math.random() * 100
  const y = Math.random() * 100
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// 输入框焦点事件
const onInputFocus = (event: Event) => {
  const target = event.target as HTMLElement
  const wrapper = target.closest('.input-wrapper')
  wrapper?.classList.add('focused')
}

const onInputBlur = (event: Event) => {
  const target = event.target as HTMLElement
  const wrapper = target.closest('.input-wrapper')
  wrapper?.classList.remove('focused')
}

// 登录处理
const handleLogin = () => {
  /* pinia 状态管理start
  console.log(userStore.name)
  userStore.incrementAge()
  console.log(userStore.age)

  console.log(dictStore.label)
  dictStore.deleteLabel()
  console.log(dictStore.label,'dictStore')
  pinia 状态管理end */


  console.log(studyRef.value,'study')



  // if (!loginForm.value.username || !loginForm.value.password) {
  //   alert('请输入用户名和密码')
  //   return
  // }
  
  // 这里可以添加实际的登录逻辑
  console.log('登录信息:', loginForm.value)
  
  // 跳转到首页
  router.push('/index')
}

// 组件挂载后的初始化
onMounted(() => {
  // 添加页面加载动画
  document.body.classList.add('login-page-loaded')
})
</script>

<style lang="scss" scoped>
// 全局变量
$primary-color: #00d4ff;
$secondary-color: #0099cc;
$accent-color: #ff6b35;
$bg-dark: #0a0a0a;
$bg-darker: #050505;
$text-light: #ffffff;
$text-muted: #888888;
$glass-bg: rgba(255, 255, 255, 0.05);
$glass-border: rgba(255, 255, 255, 0.1);

// 主容器
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, $bg-darker 0%, $bg-dark 50%, #1a1a2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
}

// 动态背景
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  .stars {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, $primary-color, transparent),
      radial-gradient(2px 2px at 40px 70px, $secondary-color, transparent),
      radial-gradient(1px 1px at 90px 40px, $accent-color, transparent),
      radial-gradient(1px 1px at 130px 80px, $primary-color, transparent),
      radial-gradient(2px 2px at 160px 30px, $secondary-color, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: twinkle 4s infinite;
  }
  
  .grid-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba($primary-color, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba($primary-color, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 20s linear infinite;
  }
  
  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    
    .particle {
      position: absolute;
      background: $primary-color;
      border-radius: 50%;
      opacity: 0.6;
      animation: float 6s ease-in-out infinite;
      
      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, $primary-color, $secondary-color);
        border-radius: 50%;
        z-index: -1;
        filter: blur(4px);
      }
    }
  }
}

// 主要内容
.content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
  padding: 2rem;
}

// Logo区域
.logo-section {
  flex: 1;
  text-align: center;
  
  .logo-icon {
    margin-bottom: 2rem;
    
    .tech-logo {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto;
      
      .logo-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid $primary-color;
        border-radius: 50%;
        border-top-color: transparent;
        animation: rotate 3s linear infinite;
        
        &::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border: 2px solid $secondary-color;
          border-radius: 50%;
          border-bottom-color: transparent;
          animation: rotate 2s linear infinite reverse;
        }
      }
      
      .logo-core {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: linear-gradient(45deg, $primary-color, $secondary-color);
        border-radius: 50%;
        box-shadow: 0 0 20px $primary-color;
        animation: pulse 2s ease-in-out infinite;
      }
    }
  }
  
  .logo-text {
    font-size: 3rem;
    font-weight: 700;
    color: $text-light;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, $primary-color, $secondary-color);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba($primary-color, 0.5);
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: $text-muted;
    margin-bottom: 2rem;
  }
}

// 登录表单
.login-form {
  flex: 1;
  max-width: 400px;
  
  .form-container {
    background: $glass-bg;
    backdrop-filter: blur(20px);
    border: 1px solid $glass-border;
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    .form-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: $text-light;
      text-align: center;
      margin-bottom: 2rem;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 2px;
        background: linear-gradient(90deg, $primary-color, $secondary-color);
        border-radius: 1px;
      }
    }
  }
}

// 输入组件
.input-group {
  margin-bottom: 1.5rem;
  
  .input-wrapper {
    position: relative;
    
    .tech-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: $text-light;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
      
      &::placeholder {
        color: $text-muted;
      }
      
      &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.08);
        border-color: $primary-color;
        box-shadow: 0 0 20px rgba($primary-color, 0.3);
      }
    }
    
    .input-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 12px;
      background: linear-gradient(45deg, $primary-color, $secondary-color);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
      
      &::before {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 1px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 11px;
      }
    }
    
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: $text-muted;
      transition: color 0.3s ease;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    &.focused {
      .input-border {
        opacity: 1;
      }
      
      .input-icon {
        color: $primary-color;
      }
    }
  }
}

// 表单选项
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
      display: none;
    }
    
    .checkmark {
      width: 18px;
      height: 18px;
      border: 2px solid $text-muted;
      border-radius: 4px;
      margin-right: 0.5rem;
      position: relative;
      transition: all 0.3s ease;
      
      &::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid $primary-color;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
    
    input:checked + .checkmark {
      background: $primary-color;
      border-color: $primary-color;
      
      &::after {
        opacity: 1;
      }
    }
    
    .checkbox-text {
      color: $text-muted;
      font-size: 0.9rem;
    }
  }
  
  .forgot-password {
    color: $primary-color;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: $secondary-color;
    }
  }
}

// 登录按钮
.login-btn {
  position: relative;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, $primary-color, $secondary-color);
  border: none;
  border-radius: 12px;
  color: $text-light;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  .btn-text {
    position: relative;
    z-index: 2;
  }
  
  .btn-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }
  
  .btn-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .btn-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      opacity: 0;
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba($primary-color, 0.4);
    
    .btn-glow {
      left: 100%;
    }
    
    .btn-particle {
      animation: particle-burst 0.6s ease-out;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

// 分割线
.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $text-muted, transparent);
  }
  
  span {
    background: $glass-bg;
    color: $text-muted;
    padding: 0 1rem;
    font-size: 0.9rem;
  }
}

// 社交登录
.social-login {
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  .social-btn {
    width: 50px;
    height: 50px;
    border: 1px solid $glass-border;
    background: $glass-bg;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    svg {
      width: 24px;
      height: 24px;
      color: $text-muted;
      transition: color 0.3s ease;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: $primary-color;
      transform: translateY(-2px);
      
      svg {
        color: $primary-color;
      }
    }
  }
}

// 装饰元素
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  
  .tech-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    
    .line {
      position: absolute;
      background: linear-gradient(90deg, transparent, $primary-color, transparent);
      
      &.line-1 {
        top: 20%;
        left: 0;
        width: 100%;
        height: 1px;
        animation: line-move-horizontal 8s linear infinite;
      }
      
      &.line-2 {
        top: 0;
        right: 30%;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent, $secondary-color, transparent);
        animation: line-move-vertical 6s linear infinite;
      }
      
      &.line-3 {
        bottom: 30%;
        left: 0;
        width: 100%;
        height: 1px;
        animation: line-move-horizontal 10s linear infinite reverse;
      }
    }
  }
  
  .corner-decorations {
    .corner {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 2px solid $primary-color;
      
      &.corner-tl {
        top: 2rem;
        left: 2rem;
        border-right: none;
        border-bottom: none;
      }
      
      &.corner-tr {
        top: 2rem;
        right: 2rem;
        border-left: none;
        border-bottom: none;
      }
      
      &.corner-bl {
        bottom: 2rem;
        left: 2rem;
        border-right: none;
        border-top: none;
      }
      
      &.corner-br {
        bottom: 2rem;
        right: 2rem;
        border-left: none;
        border-top: none;
      }
    }
  }
}

// 动画定义
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes line-move-horizontal {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
}

@keyframes line-move-vertical {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: scale(0) translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: scale(1) translate(var(--random-x, 20px), var(--random-y, -20px));
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }
  
  .logo-section {
    .logo-text {
      font-size: 2rem;
    }
    
    .tech-logo {
      width: 80px;
      height: 80px;
    }
  }
  
  .login-form {
    max-width: 100%;
    
    .form-container {
      padding: 1.5rem;
    }
  }
  
  .decorative-elements {
    .corner {
      width: 20px;
      height: 20px;
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .content {
    gap: 1rem;
  }
  
  .logo-section {
    .logo-text {
      font-size: 1.5rem;
    }
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
