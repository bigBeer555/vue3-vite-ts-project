<template>
  <div class="login-page">
    <!-- 左侧品牌展示区 -->
    <div class="brand-section">
      <div class="animated-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="brand-content">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 0L40 34.641H0L20 0Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="20" y1="0" x2="20" y2="34.641" gradientUnits="userSpaceOnUse">
                <stop stop-color="#818CF8"/>
                <stop offset="1" stop-color="#6366F1"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">VUE ADMIN</span>
        </div>
        <h1 class="slogan">探索未来的<br>数字体验</h1>
        <p class="description">
          基于 Vue 3 + TypeScript 的现代化后台管理系统解决方案。<br>
          极致性能，优雅体验。
        </p>
      </div>
      <div class="glass-overlay"></div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>请输入您的账号密码进行登录</p>
        </div>

        <form @submit.prevent="debouncedLogin" class="login-form">
          <div class="form-item">
            <label>账号</label>
            <div class="input-wrap">
              <input 
                type="text" 
                v-model="form.username" 
                placeholder="admin"
                autocomplete="off"
              >
              <div class="focus-border"></div>
            </div>
          </div>

          <div class="form-item">
            <label>密码</label>
            <div class="input-wrap">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="form.password" 
                placeholder="123456"
              >
              <span class="suffix-icon" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </span>
              <div class="focus-border"></div>
            </div>
          </div>

          <div class="form-actions">
            <label class="checkbox">
              <input type="checkbox" v-model="form.remember">
              <span class="box"></span>
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <button type="submit" class="submit-btn" :class="{ 'loading': isLoading }">
            <span v-if="!isLoading">登 录</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <div class="form-footer">
          <p>还没有账号？ <a href="#">立即注册</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import request from '@/utils/request';
import router from '@/router';
import { debounce } from '@/utils/debounce';

const form = reactive({
  username: 'admin',
  password: '123456',
  remember: false
});

const showPassword = ref(false);
const isLoading = ref(false);

const testFetch = async () => {
  // const res: any = await request({
  //   url: '/stream',
  //   method: 'GET',
  // });
  // console.log('Test fetch response:', res);

  // 浏览器 — EventSource (SSE)
const es = new EventSource('/api/stream');

es.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('message', data);
};

es.onerror = (err) => {
  console.error('SSE error', err);
  // 可选：es.close()
};
}

const handleLogin = async () => {
  if (!form.username || !form.password) return;
  
  isLoading.value = true;
  try {
    // 1. 登录请求
    const res: any = await request({
      url: '/login',
      method: 'post',
      data: form
    });

    console.log('Login response:', res);
    
    // 校验登录结果
    if (res.code !== 200 && !res.token) {
      console.warn('Login failed:', res);
      // 这里抛出错误或直接return，后续代码就不会执行了
      throw new Error(res.msg || 'Login failed');
    }

    console.log('Login success, redirecting...');
    // 存储 token
    const token = res.data?.token || res.token;
    if (token) localStorage.setItem('token', token);

    // 2. 获取用户信息（如果上面的代码抛错，这里不会执行）
    const userRes: any = await request({
      url: '/user/info',
      method: 'get'
    });

    console.log('User info response:', userRes);
    if (userRes.code === 200) {
      localStorage.setItem('userInfo', JSON.stringify(userRes.data));
    }

    // 3. 跳转主页
    router.push('/index');

  } catch (err: any) {
    console.error('Process error:', err);
    // 可以在这里统一处理错误提示
  } finally {
    isLoading.value = false;
  }
};

const debouncedLogin = debounce(handleLogin, 1000);
</script>

<style scoped>
.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #0f172a; /* 深色背景 */
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #e2e8f0;
}

/* 左侧品牌区 */
.brand-section {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  background: #020617;
  overflow: hidden;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: #4f46e5;
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: #7c3aed;
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: #ec4899;
  top: 40%;
  left: 40%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -50px); }
  66% { transform: translate(-20px, 20px); }
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  z-index: 1;
}

.brand-content {
  position: relative;
  z-index: 10;
  max-width: 600px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}

.slogan {
  font-size: 56px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.description {
  font-size: 18px;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 480px;
}

/* 右侧表单区 */
.form-section {
  width: 500px;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 20;
}

.form-container {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #f8fafc;
}

.form-header p {
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-item label {
  display: block;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  width: 100%;
  height: 44px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  padding: 0 16px;
  color: #f8fafc;
  font-size: 14px;
  transition: all 0.2s;
}

.input-wrap input:focus {
  outline: none;
  background: rgba(15, 23, 42, 0.8);
  border-color: #6366f1;
}

.focus-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #6366f1;
  transition: width 0.3s ease;
  z-index: 2;
  border-radius: 0 0 8px 8px; /* 匹配input圆角 */
}

.input-wrap input:focus + .focus-border,
.input-wrap input:focus ~ .focus-border {
  width: 100%;
}

.suffix-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  cursor: pointer;
  display: flex;
}

.suffix-icon:hover {
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #94a3b8;
}

.checkbox input {
  display: none;
}

.checkbox .box {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox input:checked + .box {
  background: #6366f1;
  border-color: #6366f1;
}

.checkbox input:checked + .box::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  color: #6366f1;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #818cf8;
}

.submit-btn {
  height: 44px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.6);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn.loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.form-footer a {
  color: #f8fafc;
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* 响应式适配 */
@media screen and (max-width: 960px) {
  .brand-section {
    display: none;
  }
  
  .form-section {
    width: 100%;
    background: #0f172a;
    border: none;
  }
  
  .form-container {
    max-width: 400px;
  }
}

</style>
