<template>
  <div class="dashboard-container">
    <!-- 动态背景 -->
    <div class="background">
      <div class="stars"></div>
      <div class="grid-overlay"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 15" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <div class="tech-logo">
              <div class="logo-ring"></div>
              <div class="logo-core"></div>
            </div>
          </div>
          <span class="logo-text" v-show="!sidebarCollapsed">TechAdmin</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="section-title" v-show="!sidebarCollapsed">主要功能</div>
          <ul class="nav-menu">
            <li class="nav-item" :class="{ active: activeMenu === 'dashboard' }" @click="setActiveMenu('dashboard')">
              <div class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                </svg>
                <span class="nav-text" v-show="!sidebarCollapsed">仪表盘</span>
              </div>
            </li>
            <li class="nav-item" :class="{ active: activeMenu === 'users' }" @click="setActiveMenu('users')">
              <div class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,4C18.11,4 19.8,5.69 19.8,7.8C19.8,9.91 18.11,11.6 16,11.6C13.89,11.6 12.2,9.91 12.2,7.8C12.2,5.69 13.89,4 16,4M16,13.4C18.67,13.4 24,14.73 24,17.4V20H8V17.4C8,14.73 13.33,13.4 16,13.4M8.8,7.8C8.8,9.91 7.11,11.6 5,11.6C2.89,11.6 1.2,9.91 1.2,7.8C1.2,5.69 2.89,4 5,4C7.11,4 8.8,5.69 8.8,7.8M5,13.4C7.67,13.4 13,14.73 13,17.4V20H0V17.4C0,14.73 5.33,13.4 5,13.4Z" />
                </svg>
                <span class="nav-text" v-show="!sidebarCollapsed">用户管理</span>
              </div>
            </li>
            <li class="nav-item" :class="{ active: activeMenu === 'analytics' }" @click="setActiveMenu('analytics')">
              <div class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z" />
                </svg>
                <span class="nav-text" v-show="!sidebarCollapsed">数据分析</span>
              </div>
            </li>
            <li class="nav-item" :class="{ active: activeMenu === 'settings' }" @click="setActiveMenu('settings')">
              <div class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                </svg>
                <span class="nav-text" v-show="!sidebarCollapsed">系统设置</span>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <div class="section-title" v-show="!sidebarCollapsed">工具</div>
          <ul class="nav-menu">
            <li class="nav-item" :class="{ active: activeMenu === 'tools' }" @click="setActiveMenu('tools')">
              <div class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z" />
                </svg>
                <span class="nav-text" v-show="!sidebarCollapsed">工具箱</span>
              </div>
            </li>
            <li class="nav-item" :class="{ active: activeMenu === 'help' }" @click="setActiveMenu('help')">
              <div class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
                </svg>
                <span class="nav-text" v-show="!sidebarCollapsed">帮助中心</span>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-info" v-show="!sidebarCollapsed">
          <div class="user-avatar">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="用户头像">
          </div>
          <div class="user-details">
            <div class="user-name">管理员</div>
            <div class="user-role">系统管理员</div>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content" :class="{ expanded: sidebarCollapsed }">
      <!-- 顶部导航栏 -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">{{ getPageTitle() }}</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">首页</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">{{ getPageTitle() }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <!-- AI Chat Component -->
            <AiChat />
            
            <button class="action-btn" @click="toggleTheme">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5Z" />
              </svg>
            </button>
            <button class="action-btn" @click="jumpTo('customer')">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5Z" />
              </svg>
            </button>
            <button class="action-btn" @click="jumpTo('messages')">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21" />
              </svg>
              <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content-area">
        <div class="dashboard-grid" v-if="activeMenu === 'dashboard'">
          <!-- 统计卡片 -->
          <div class="stats-cards">
            <div class="stat-card" v-for="stat in stats" :key="stat.id">
              <div class="stat-icon" :style="{ background: stat.color }">
                <svg viewBox="0 0 24 24" fill="currentColor" v-html="stat.icon"></svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.trend">
                  <span class="change-icon">{{ stat.trend === 'up' ? '↗' : '↘' }}</span>
                  <span>{{ stat.change }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="charts-section">
            <div class="chart-card">
              <div class="card-header">
                <h3>数据趋势</h3>
                <div class="chart-controls">
                  <button class="control-btn active">日</button>
                  <button class="control-btn">周</button>
                  <button class="control-btn">月</button>
                </div>
              </div>
              <div class="chart-content">
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div class="bar" v-for="i in 12" :key="i" :style="{ height: Math.random() * 100 + 20 + 'px' }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chart-card">
              <div class="card-header">
                <h3>系统状态</h3>
              </div>
              <div class="chart-content">
                <div class="system-status">
                  <div class="status-item">
                    <div class="status-indicator online"></div>
                    <span>服务器状态: 正常</span>
                  </div>
                  <div class="status-item">
                    <div class="status-indicator online"></div>
                    <span>数据库: 正常</span>
                  </div>
                  <div class="status-item">
                    <div class="status-indicator warning"></div>
                    <span>缓存: 警告</span>
                  </div>
                  <div class="status-item">
                    <div class="status-indicator online"></div>
                    <span>API: 正常</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="activity-section">
            <div class="activity-card">
              <div class="card-header">
                <h3>最近活动1</h3>
                <button class="view-all-btn">查看全部</button>
              </div>
              <div class="activity-list">
                <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                  <div class="activity-avatar">
                    <img :src="activity.avatar" :alt="activity.user">
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                  <div class="activity-type" :class="activity.type"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="activity-section">
            <div class="activity-card">
              <div class="card-header">
                <h3>最近活动2</h3>
                <button class="view-all-btn">查看全部</button>
              </div>
              <div class="activity-list">
                <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                  <div class="activity-avatar">
                    <img :src="activity.avatar" :alt="activity.user">
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                  <div class="activity-type" :class="activity.type"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="activity-section">
            <div class="activity-card">
              <div class="card-header">
                <h3>最近活动3</h3>
                <button class="view-all-btn">查看全部</button>
              </div>
              <div class="activity-list">
                <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                  <div class="activity-avatar">
                    <img :src="activity.avatar" :alt="activity.user">
                  </div> 
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                  <div class="activity-type" :class="activity.type"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="activity-section">
            <div class="activity-card">
              <div class="card-header">
                <h3>最近活动4</h3>
                <button class="view-all-btn">查看全部</button>
              </div>
              <div class="activity-list">
                <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                  <div class="activity-avatar">
                    <img :src="activity.avatar" :alt="activity.user">
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                  <div class="activity-type" :class="activity.type"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 画布 -->
          <div class="canvas-section">
            <!-- <SignCanvas title="明华" /> -->
          </div>
          
          <!-- 测试滚动内容 -->
          <div class="scroll-test-section" style="margin-top: 50px;">
            <div class="activity-card" v-for="i in 10" :key="'test-' + i">
              <div class="card-header">
                <h3>测试滚动区域 {{ i }}</h3>
              </div>
              <div class="activity-list">
                <div class="activity-item" style="padding: 20px; margin: 10px 0; background: rgba(255,255,255,0.05); border-radius: 8px;">
                  <div class="activity-content">
                    <div class="activity-text">这是第 {{ i }} 个测试区域，用于测试页面滚动功能。当你在页面间切换时，应该能看到页面滚动到顶部的效果。</div>
                    <div class="activity-time">测试时间: {{ new Date().toLocaleTimeString() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他页面内容 -->
        <div class="page-content" v-else>
          <div class="content-placeholder">
            <div class="placeholder-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
              </svg>
            </div>
            <h3>{{ getPageTitle() }}</h3>
            <p>此页面正在开发中...</p>
            <button class="primary-btn" @click="handleClick">测试按钮</button>
          </div>
        </div>
      </main>
    </div>

    <!-- 装饰元素 -->
    <div class="decorative-elements">
      <div class="tech-lines">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
      </div>
    </div>
  </div>
</template>
<!-- 
 加载：
   - 资源：tree-shaking、分包、图片(雪碧图和图片压缩)、懒加载
   - 网络传输：CDN、Http缓存(固定的数据使用本地缓存)、Gzip / Brotli 压缩：减小传输体积
 渲染： 减少重排和重绘（多使用transition和opacity代替top、left、元素隐藏）
 交互：使用骨架屏/占位图、
 脚本
-->
<script setup lang="ts">
import { ref, onMounted, onActivated, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AiChat from '@/components/AiChat/index.vue'
import request from '@/utils/request'
import { debounce } from '@/utils/debounce'
import { eventBus } from '@/utils/evenBus'

// import SignCanvas from '@/components/Canvas/index.vue'


const router = useRouter()

interface Activity {
  id: number
  label: string
  value: string
  change: string
  trend: string
  color: string
  icon: string
}

interface User {
  name: string
  email: string
  role: string
  avatar: string
}

// 响应式数据
const sidebarCollapsed = ref<boolean>(false)
const activeMenu = ref<string>('dashboard')
const notificationCount = ref<number>(3)
/* 内置类型
/ Rerord <'a', string> 相当于{ a: string }  ps:生产一个属性为K
/ Partial 全部变可选
/ Required 全部变必选
/ Readonly 全部变只读
/ Pick 提取一个属性
/ Exclude <T, U> 从 T 中排除掉所有包含的 U 属性 
/ Extract <T, U> 相反 Extract 提取 T 和 U 都有的
/ NonNullable 去除 null 和 underfined
/ Parameters 传入一个函数 返回 函数的参数数组
 */ 
const user = reactive<Readonly<User>>({
  name: '张三',
  email: 'zhangsan@example.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
})



// 统计数据
const stats = ref<Activity[]>([
  {
    id: 1,
    label: '总用户数',
    value: '12,345',
    change: '+12.5%',
    trend: 'up',
    color: 'linear-gradient(45deg, #6366f1, #4f46e5)', // Indigo
    icon: '<path d="M16,4C18.11,4 19.8,5.69 19.8,7.8C19.8,9.91 18.11,11.6 16,11.6C13.89,11.6 12.2,9.91 12.2,7.8C12.2,5.69 13.89,4 16,4M16,13.4C18.67,13.4 24,14.73 24,17.4V20H8V17.4C8,14.73 13.33,13.4 16,13.4Z" />'
  },
  {
    id: 2,
    label: '今日访问',
    value: '8,967',
    change: '+8.2%',
    trend: 'up',
    color: 'linear-gradient(45deg, #ec4899, #db2777)', // Pink
    icon: '<path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />'
  },
  {
    id: 3,
    label: '系统负载',
    value: '67%',
    change: '-3.1%',
    trend: 'down',
    color: 'linear-gradient(45deg, #8b5cf6, #7c3aed)', // Violet
    icon: '<path d="M13,2.05V5.08C16.39,5.57 19,8.47 19,12C19,12.9 18.82,13.75 18.5,14.54L21.12,16.07C21.68,14.83 22,13.45 22,12C22,6.82 18.05,2.55 13,2.05M12,19C8.47,19 5.57,16.39 5.08,13H2.05C2.55,18.05 6.82,22 12,22C13.45,22 14.83,21.68 16.07,21.12L14.54,18.5C13.75,18.82 12.9,19 12,19M2.05,11H5.08C5.57,7.61 8.47,5 12,5C12.9,5 13.75,5.18 14.54,5.5L16.07,2.88C14.83,2.32 13.45,2 12,2C6.82,2 2.55,6.05 2.05,11Z" />'
  },
  {
    id: 4,
    label: '收入',
    value: '¥45,678',
    change: '+15.3%',
    trend: 'up',
    color: 'linear-gradient(45deg, #06b6d4, #0891b2)', // Cyan
    icon: '<path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />'
  }
])

// 最近活动数据
const recentActivities = ref([
  {
    id: 1,
    user: '张三',
    text: '创建了新的项目',
    time: '2分钟前',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    type: 'create'
  },
  {
    id: 2,
    user: '李四',
    text: '更新了用户权限',
    time: '5分钟前',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    type: 'update'
  },
  {
    id: 3,
    user: '王五',
    text: '删除了过期数据',
    time: '10分钟前',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    type: 'delete'
  }
])

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const getMsg = (obj: User) => {
  console.log(obj,'obj')
  // return obj.map(item => item.label)
}

// 泛型映射函数：根据输入值返回对应的映射值
// const getStatColor = <T extends string | number, R = string>(
//   value: T,
//   mappings: Record<T, R>,
//   defaultValue?: R
// ): R => {
//   return mappings[value] ?? defaultValue ?? mappings[Object.keys(mappings)[0] as T]
// }

// // 趋势颜色映射配置
// const trendColorMap = {
//   'up': 'text-green-500',
//   'down': 'text-red-500',
//   'stable': 'text-gray-500'
// } as const

// // 使用示例的辅助函数
// const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
//   return getStatColor(trend, trendColorMap)
// }

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu
}

const getPageTitle = () => {
  const titles: Record<string, string> = {
    dashboard: '仪表盘',
    users: '用户管理',
    analytics: '数据分析',
    settings: '系统设置',
    tools: '工具箱',
    help: '帮助中心',
    1: '统计数据'
  }
  return titles[activeMenu.value] || '仪表盘'
}

const toggleTheme = () => {
  router.push('/draw')
}

const jumpTo = (type: string) => {
  router.push(`/${type}`)
}

const handleLogout = () => {
  router.push('/')
}

// 粒子动画样式
const getParticleStyle = (index: number) => {
  const delay = Math.random() * 5
  const duration = 4 + Math.random() * 6
  const size = 1 + Math.random() * 3
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

// 原有的测试方法
const rawClick = () => {
  console.log('点击了按钮：', new Date().toLocaleTimeString())
  getList()
}

const handleClick = debounce(rawClick, 1000)

function getList() {
  request({
    url: '/api/goods/banner/list'
  }).then(res => {
    console.log('request', res)
  }).catch(err => {
    console.error('请求失败:', err)
  })
}
onActivated(() => {
  eventBus.onOpenPreview((isShow) => {
    console.log('onOpenPreview', isShow)
  })
})
// 组件挂载
onMounted(() => {
  console.log('Dashboard mounted')
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }
  getMsg(user)
})
</script>

<style lang="scss" scoped>
// 全局变量
$primary-color: #6366f1; // Indigo
$secondary-color: #8b5cf6; // Violet
$accent-color: #ec4899; // Pink
$bg-dark: #0f172a; // Slate-900
$bg-darker: #020617; // Slate-950
$text-light: #f8fafc; // Slate-50
$text-muted: #94a3b8; // Slate-400
$glass-bg: rgba(30, 41, 59, 0.7); // Darker glass to match login
$glass-border: rgba(255, 255, 255, 0.08);
$sidebar-width: 280px;
$sidebar-collapsed-width: 70px;
$header-height: 70px;

// 主容器
.dashboard-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: $bg-dark; // Solid background like login
  color: $text-light;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; // Match login font
}

// 动态背景
.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden; // Ensure orbs don't cause scrollbars
    
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4; // Slightly lower opacity for dashboard content readability
      animation: float-orb 20s infinite ease-in-out;
      z-index: 0;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: #4f46e5; // Indigo-600
      top: -100px;
      left: -100px;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: #7c3aed; // Violet-600
      bottom: -100px;
      right: -100px;
      animation-delay: -5s;
    }

    .orb-3 {
      width: 300px;
      height: 300px;
      background: #ec4899; // Pink-500
      top: 40%;
      left: 40%;
      animation-delay: -10s;
    }

    .stars {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, $primary-color, transparent),
      radial-gradient(1px 1px at 40px 70px, $secondary-color, transparent),
      radial-gradient(1px 1px at 90px 40px, $accent-color, transparent),
      radial-gradient(1px 1px at 130px 80px, $primary-color, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: twinkle 6s infinite;
    opacity: 0.3;
  }
  
  .grid-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba($primary-color, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba($primary-color, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 30s linear infinite;
  }
  
  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    
    .particle {
      position: absolute;
      background: $primary-color;
      border-radius: 50%;
      opacity: 0.4;
      animation: float 8s ease-in-out infinite;
    }
  }
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -50px); }
  66% { transform: translate(-20px, 20px); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

// 侧边栏
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: $sidebar-width;
  height: 100vh;
  background: $glass-bg;
  backdrop-filter: blur(20px);
  border-right: 1px solid $glass-border;
  z-index: 100;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &.collapsed {
    width: $sidebar-collapsed-width;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid $glass-border;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .logo-icon {
        .tech-logo {
          position: relative;
          width: 40px;
          height: 40px;
          
          .logo-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid $primary-color;
            border-radius: 50%;
            border-top-color: transparent;
            animation: rotate 3s linear infinite;
          }
          
          .logo-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: linear-gradient(45deg, $primary-color, $secondary-color);
            border-radius: 50%;
            box-shadow: 0 0 10px $primary-color;
          }
        }
      }
      
      .logo-text {
        font-size: 1.5rem;
        font-weight: 700;
        color: $text-light;
        background: linear-gradient(45deg, $primary-color, $secondary-color);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .collapse-btn {
      width: 32px;
      height: 32px;
      background: transparent;
      border: 1px solid $glass-border;
      border-radius: 6px;
      color: $text-muted;
      cursor: pointer;
      transition: all 0.3s ease;
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      &:hover {
        background: $glass-bg;
        border-color: $primary-color;
        color: $primary-color;
      }
    }
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
    
    .nav-section {
      margin-bottom: 2rem;
      
      .section-title {
        padding: 0 1.5rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .nav-menu {
        list-style: none;
        padding: 0;
        margin: 0;
        
        .nav-item {
          margin: 0.25rem 1rem;
          
          .nav-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            color: $text-muted;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            
            .nav-icon {
              width: 20px;
              height: 20px;
              flex-shrink: 0;
            }
            
            .nav-text {
              font-weight: 500;
            }
            
            &:hover {
              background: rgba($primary-color, 0.1);
              color: $primary-color;
            }
          }
          
          &.active .nav-link {
            background: linear-gradient(90deg, rgba($primary-color, 0.2), rgba($secondary-color, 0.1));
            color: $primary-color;
            border-left: 3px solid $primary-color;
            
            &::before {
              content: '';
              position: absolute;
              right: 1rem;
              top: 50%;
              transform: translateY(-50%);
              width: 6px;
              height: 6px;
              background: $primary-color;
              border-radius: 50%;
              box-shadow: 0 0 10px $primary-color;
            }
          }
        }
      }
    }
  }
  
  .sidebar-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid $glass-border;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid $glass-border;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .user-details {
        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: $text-light;
        }
        
        .user-role {
          font-size: 0.75rem;
          color: $text-muted;
        }
      }
    }
    
    .logout-btn {
      width: 32px;
      height: 32px;
      background: transparent;
      border: 1px solid $glass-border;
      border-radius: 6px;
      color: $text-muted;
      cursor: pointer;
      transition: all 0.3s ease;
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      &:hover {
        background: rgba($accent-color, 0.1);
        border-color: $accent-color;
        color: $accent-color;
      }
    }
  }
}

// 主内容区域
.main-content {
  margin-left: $sidebar-width;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  position: relative;
  z-index: 10;
  
  &.expanded {
    margin-left: $sidebar-collapsed-width;
  }
  
  .top-header {
    height: $header-height;
    background: $glass-bg;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid $glass-border;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-left {
      .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: $text-light;
        margin: 0 0 0.25rem 0;
      }
      
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        
        .breadcrumb-item {
          color: $text-muted;
          
          &.active {
            color: $primary-color;
          }
        }
        
        .breadcrumb-separator {
          color: $text-muted;
        }
      }
    }
    
    .header-right {
      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .action-btn {
          position: relative;
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1px solid $glass-border;
          border-radius: 8px;
          color: $text-muted;
          cursor: pointer;
          transition: all 0.3s ease;
          
          svg {
            width: 20px;
            height: 20px;
          }
          
          .notification-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 18px;
            height: 18px;
            background: $accent-color;
            border-radius: 50%;
            font-size: 0.75rem;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          &:hover {
            background: $glass-bg;
            border-color: $primary-color;
            color: $primary-color;
          }
        }
      }
    }
  }
  
  .content-area {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    
    .dashboard-grid {
      display: grid;
      gap: 2rem;
      
      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        
        .stat-card {
          background: $glass-bg;
          backdrop-filter: blur(20px);
          border: 1px solid $glass-border;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border-color: rgba($primary-color, 0.3);
          }
          
          .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            svg {
              width: 28px;
              height: 28px;
              color: white;
            }
          }
          
          .stat-content {
            flex: 1;
            
            .stat-value {
              font-size: 1.75rem;
              font-weight: 700;
              color: $text-light;
              margin-bottom: 0.25rem;
            }
            
            .stat-label {
              font-size: 0.875rem;
              color: $text-muted;
              margin-bottom: 0.5rem;
            }
            
            .stat-change {
              display: flex;
              align-items: center;
              gap: 0.25rem;
              font-size: 0.75rem;
              font-weight: 600;
              
              &.up {
                color: #4ade80;
              }
              
              &.down {
                color: #f87171;
              }
            }
          }
        }
      }
      
      .charts-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        
        .chart-card {
          background: $glass-bg;
          backdrop-filter: blur(20px);
          border: 1px solid $glass-border;
          border-radius: 16px;
          padding: 1.5rem;
          
          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            
            h3 {
              font-size: 1.125rem;
              font-weight: 600;
              color: $text-light;
              margin: 0;
            }
            
            .chart-controls {
              display: flex;
              gap: 0.5rem;
              
              .control-btn {
                padding: 0.5rem 1rem;
                background: transparent;
                border: 1px solid $glass-border;
                border-radius: 6px;
                color: $text-muted;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s ease;
                
                &.active,
                &:hover {
                  background: $primary-color;
                  border-color: $primary-color;
                  color: white;
                }
              }
            }
          }
          
          .chart-content {
            .chart-placeholder {
              height: 200px;
              display: flex;
              align-items: end;
              justify-content: center;
              
              .chart-bars {
                display: flex;
                align-items: end;
                gap: 8px;
                height: 100%;
                
                .bar {
                  width: 20px;
                  background: linear-gradient(to top, $primary-color, $secondary-color);
                  border-radius: 2px 2px 0 0;
                  animation: bar-grow 1s ease-out;
                }
              }
            }
            
            .system-status {
              .status-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 0;
                border-bottom: 1px solid rgba($glass-border, 0.5);
                
                &:last-child {
                  border-bottom: none;
                }
                
                .status-indicator {
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  
                  &.online {
                    background: #4ade80;
                    box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
                  }
                  
                  &.warning {
                    background: #fbbf24;
                    box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
                  }
                  
                  &.offline {
                    background: #f87171;
                    box-shadow: 0 0 10px rgba(248, 113, 113, 0.5);
                  }
                }
                
                span {
                  color: $text-light;
                  font-size: 0.875rem;
                }
              }
            }
          }
        }
      }
      
      .activity-section {
        .activity-card {
          background: $glass-bg;
          backdrop-filter: blur(20px);
          border: 1px solid $glass-border;
          border-radius: 16px;
          padding: 1.5rem;
          
          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            
            h3 {
              font-size: 1.125rem;
              font-weight: 600;
              color: $text-light;
              margin: 0;
            }
            
            .view-all-btn {
              background: transparent;
              border: none;
              color: $primary-color;
              font-size: 0.875rem;
              cursor: pointer;
              transition: color 0.3s ease;
              
              &:hover {
                color: $secondary-color;
              }
            }
          }
          
          .activity-list {
            .activity-item {
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 1rem 0;
              border-bottom: 1px solid rgba($glass-border, 0.5);
              
              &:last-child {
                border-bottom: none;
              }
              
              .activity-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
              
              .activity-content {
                flex: 1;
                
                .activity-text {
                  color: $text-light;
                  font-size: 0.875rem;
                  margin-bottom: 0.25rem;
                }
                
                .activity-time {
                  color: $text-muted;
                  font-size: 0.75rem;
                }
              }
              
              .activity-type {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                
                &.create {
                  background: #4ade80;
                }
                
                &.update {
                  background: #3b82f6;
                }
                
                &.delete {
                  background: #f87171;
                }
              }
            }
          }
        }
      }
    }
    
    .page-content {
      .content-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        text-align: center;
        
        .placeholder-icon {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
          color: $text-muted;
          
          svg {
            width: 100%;
            height: 100%;
          }
        }
        
        h3 {
          font-size: 1.5rem;
          color: $text-light;
          margin-bottom: 0.5rem;
        }
        
        p {
          color: $text-muted;
          margin-bottom: 2rem;
        }
        
        .primary-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, $primary-color, $secondary-color);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba($primary-color, 0.3);
          }
        }
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
      background: linear-gradient(90deg, transparent, rgba($primary-color, 0.3), transparent);
      
      &.line-1 {
        top: 30%;
        left: 0;
        width: 100%;
        height: 1px;
        animation: line-move-horizontal 15s linear infinite;
      }
      
      &.line-2 {
        top: 0;
        right: 20%;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent, rgba($secondary-color, 0.3), transparent);
        animation: line-move-vertical 12s linear infinite;
      }
    }
  }
}

// 动画定义
@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(120deg); }
  66% { transform: translateY(8px) rotate(240deg); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes line-move-horizontal {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
}

@keyframes line-move-vertical {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes bar-grow {
  0% { height: 0; }
  100% { height: var(--height); }
}

// 响应式设计
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    
    &.collapsed {
      transform: translateX(0);
    }
  }
  
  .main-content {
    margin-left: 0;
    
    &.expanded {
      margin-left: $sidebar-collapsed-width;
    }
  }
  
  .charts-section {
    grid-template-columns: 1fr !important;
  }
  
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
  }
}

@media (max-width: 768px) {
  .main-content {
    .content-area {
      padding: 1rem;
    }
    
    .top-header {
      padding: 0 1rem;
      
      .header-left {
        .page-title {
          font-size: 1.25rem;
        }
      }
    }
  }
  
  .stats-cards {
    grid-template-columns: 1fr !important;
  }
}
</style>
