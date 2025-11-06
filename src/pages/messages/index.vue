<template>
  <div class="messages-container">
    <!-- 动态背景 -->
    <div class="background">
      <div class="stars"></div>
      <div class="grid-overlay"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 15" :key="i" :style="getParticleStyle()"></div>
      </div>
    </div>

    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
        </button>
        <h1 class="page-title">消息中心</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">首页</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item active">消息中心</span>
        </div>
      </div>
      <div class="header-right">
        <div class="header-actions">
          <button class="action-btn" @click="markAllAsRead">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
            <span>全部已读</span>
          </button>
          <button class="action-btn" @click="refreshMessages">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- 消息过滤器 -->
    <div class="message-filters">
      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'all' }" 
          @click="setFilter('all')"
        >
          全部消息 <span class="count">({{ messages.length }})</span>
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'unread' }" 
          @click="setFilter('unread')"
        >
          未读消息 <span class="count">({{ unreadCount }})</span>
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'system' }" 
          @click="setFilter('system')"
        >
          系统通知 <span class="count">({{ systemCount }})</span>
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'user' }" 
          @click="setFilter('user')"
        >
          用户消息 <span class="count">({{ userCount }})</span>
        </button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-content">
      <div class="messages-list" ref="messagesList">
        <div 
          class="message-item" 
          :class="{ unread: !message.read, selected: selectedMessage === message.id }"
          v-for="message in filteredMessages" 
          :key="message.id"
          @click="selectMessage(message)"
        >
          <div class="message-avatar">
            <img :src="message.avatar" :alt="message.sender" v-if="message.avatar">
            <div class="avatar-placeholder" v-else>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
          </div>
          
          <div class="message-content">
            <div class="message-header">
              <div class="message-sender">{{ message.sender }}</div>
              {{ message.time }}
              <div class="message-time">{{ formatTime(message.time) }}</div>
            </div>
            <div class="message-title">{{ message.title }}</div>
            <div class="message-preview">{{ message.content }}</div>
            <div class="message-tags" v-if="message.tags && message.tags.length">
              <span class="tag" :class="tag.type" v-for="tag in message.tags" :key="tag.name">
                {{ tag.name }}
              </span>
            </div>
          </div>
          
          <div class="message-actions">
            <div class="message-type" :class="message.type">
              <svg viewBox="0 0 24 24" fill="currentColor" v-if="message.type === 'system'">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7V13H13V7H11M11,15V17H13V15H11Z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" v-else-if="message.type === 'user'">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" v-else>
                <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19Z" />
              </svg>
            </div>
            <div class="unread-indicator" v-if="!message.read"></div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more" id="loadmore" v-if="hasMore" @click="loadMore">
          <button class="load-more-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
            加载更多消息
          </button>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-if="filteredMessages.length === 0">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19Z" />
            </svg>
          </div>
          <div class="empty-text">暂无消息</div>
          <div class="empty-subtext">当有新消息时，会在这里显示</div>
        </div>
      </div>
    </div>

    <!-- 测试滚动内容 -->
    <div class="scroll-test-section" style="margin-top: 50px; padding: 20px;">
      <div class="test-card" v-for="i in 15" :key="'test-' + i" style="margin-bottom: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h3 style="color: #64ffda; margin-bottom: 10px;">测试滚动区域 {{ i }}</h3>
        <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">这是第 {{ i }} 个测试区域，用于测试消息页面的滚动功能。当你从首页切换到消息页面，或者从消息页面切换到首页时，应该能看到页面平滑滚动到顶部的效果。</p>
        <div style="margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.5);">测试时间: {{ new Date().toLocaleTimeString() }}</div>
      </div>
    </div>

    <!-- 装饰性科技线条 -->
    <div class="decorative-elements">
      <div class="tech-lines">
        <div class="line horizontal" v-for="i in 3" :key="'h' + i"></div>
        <div class="line vertical" v-for="i in 3" :key="'v' + i"></div>
      </div>
      <div class="corner-decorations">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const activeFilter = ref('all')
const selectedMessage = ref(null)
const hasMore = ref(true)
const messagesList = ref(null)

// 模拟消息数据
const messages = ref([
  {
    id: 1,
    sender: '系统管理员',
    title: '系统维护通知',
    content: '系统将于今晚23:00-01:00进行例行维护，期间可能影响部分功能使用，请提前做好相关准备。',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
    read: false,
    type: 'system',
    avatar: null,
    tags: [{ name: '重要', type: 'important' }]
  },
  {
    id: 2,
    sender: '张三',
    title: '项目进度更新',
    content: '前端开发已完成80%，预计本周五可以提交测试版本，请相关人员做好测试准备。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    read: true,
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    tags: [{ name: '项目', type: 'project' }]
  },
  {
    id: 3,
    sender: '安全中心',
    title: '登录异常提醒',
    content: '检测到您的账户在异地登录，如非本人操作，请立即修改密码并联系管理员。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4小时前
    read: false,
    type: 'system',
    avatar: null,
    tags: [{ name: '安全', type: 'security' }]
  },
  {
    id: 4,
    sender: '李四',
    title: '会议邀请',
    content: '邀请您参加明天下午2点的产品评审会议，会议地点：会议室A，请准时参加。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6小时前
    read: true,
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    tags: [{ name: '会议', type: 'meeting' }]
  },
  {
    id: 5,
    sender: '数据中心',
    title: '数据备份完成',
    content: '今日数据备份已成功完成，备份文件大小：2.3GB，备份时间：23:30-00:15。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12小时前
    read: true,
    type: 'system',
    avatar: null,
    tags: [{ name: '备份', type: 'backup' }]
  },
  {
    id: 6,
    sender: '王五',
    title: '代码审查请求',
    content: '请帮忙审查一下新功能的代码，主要涉及用户权限管理模块，代码已提交到dev分支。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18小时前
    read: false,
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    tags: [{ name: '代码', type: 'code' }]
  },
  {
    id: 7,
    sender: '系统监控',
    title: '服务器性能报告',
    content: 'CPU使用率：65%，内存使用率：78%，磁盘使用率：45%，网络流量正常。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    read: true,
    type: 'system',
    avatar: null,
    tags: [{ name: '监控', type: 'monitor' }]
  },
  {
    id: 8,
    sender: '赵六',
    title: '设计稿确认',
    content: '新版本的UI设计稿已完成，请查看附件并提供反馈意见，设计稿包含登录页和主页面。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30小时前
    read: true,
    type: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    tags: [{ name: '设计', type: 'design' }]
  }
])

// 计算属性
const filteredMessages = computed(() => {
  switch (activeFilter.value) {
    case 'unread':
      return messages.value.filter(msg => !msg.read)
    case 'system':
      return messages.value.filter(msg => msg.type === 'system')
    case 'user':
      return messages.value.filter(msg => msg.type === 'user')
    default:
      return messages.value
  }
})

const unreadCount = computed(() => messages.value.filter(msg => !msg.read).length)
const systemCount = computed(() => messages.value.filter(msg => msg.type === 'system').length)
const userCount = computed(() => messages.value.filter(msg => msg.type === 'user').length)

// 方法
const goBack = () => {
  router.back()
}

const setFilter = (filter) => {
  activeFilter.value = filter
}

const selectMessage = (message) => {
  selectedMessage.value = message.id
  if (!message.read) {
    message.read = true
  }
}

const markAllAsRead = () => {
  messages.value.forEach(msg => {
    msg.read = true
  })
}

const refreshMessages = () => {
  // 模拟刷新
  console.log('刷新消息列表')
}

const loadMore = () => {
  // 模拟加载更多
  console.log('加载更多消息')
  hasMore.value = false
}

const formatTime = (time:string | Date) => {
  const now = new Date().getTime()
  const diff = now - new Date(time).getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${days}天前`
  }
}

const getParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    animationDuration: (Math.random() * 3 + 2) + 's'
  }
}

// 生命周期
onMounted(() => {
  // 组件挂载后的逻辑
})
</script>

<style lang="scss" scoped>
$primary-color: #00d4ff;
$secondary-color: #ff6b6b;
$accent-color: #4ecdc4;
$bg-dark: #0a0a0a;
$bg-darker: #050505;
$text-light: #ffffff;
$text-muted: #888888;
$border-color: rgba(255, 255, 255, 0.1);

.messages-container {
  min-height: 100vh;
  background: linear-gradient(135deg, $bg-darker 0%, $bg-dark 50%, #1a1a2e 100%);
  color: $text-light;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

// 动态背景
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;

  .stars {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(2px 2px at 20px 30px, $primary-color, transparent),
                radial-gradient(2px 2px at 40px 70px, $accent-color, transparent),
                radial-gradient(1px 1px at 90px 40px, $secondary-color, transparent),
                radial-gradient(1px 1px at 130px 80px, $primary-color, transparent),
                radial-gradient(2px 2px at 160px 30px, $accent-color, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: twinkle 4s ease-in-out infinite alternate;
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
      width: 4px;
      height: 4px;
      background: $primary-color;
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
      opacity: 0.6;
    }
  }
}

// 顶部导航栏
.top-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $border-color;

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba($primary-color, 0.1);
      border: 1px solid rgba($primary-color, 0.3);
      border-radius: 8px;
      color: $primary-color;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba($primary-color, 0.2);
        transform: translateX(-2px);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      background: linear-gradient(45deg, $primary-color, $accent-color);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: $text-muted;

      .breadcrumb-item.active {
        color: $primary-color;
      }
    }
  }

  .header-right {
    .header-actions {
      display: flex;
      gap: 0.5rem;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba($primary-color, 0.1);
        border: 1px solid rgba($primary-color, 0.3);
        border-radius: 8px;
        color: $primary-color;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;

        &:hover {
          background: rgba($primary-color, 0.2);
          transform: translateY(-2px);
        }

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

// 消息过滤器
.message-filters {
  position: relative;
  z-index: 10;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid $border-color;

  .filter-tabs {
    display: flex;
    gap: 1rem;

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: 1px solid $border-color;
      border-radius: 25px;
      color: $text-muted;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;

      .count {
        background: rgba($primary-color, 0.2);
        color: $primary-color;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
      }

      &.active {
        background: rgba($primary-color, 0.1);
        border-color: $primary-color;
        color: $primary-color;
      }

      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

// 消息内容区域
.messages-content {
  position: relative;
  z-index: 10;
  padding: 1rem 2rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .message-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid $border-color;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba($primary-color, 0.3);
        transform: translateY(-2px);
      }

      &.unread {
        border-left: 4px solid $primary-color;
        background: rgba($primary-color, 0.05);
      }

      &.selected {
        background: rgba($primary-color, 0.1);
        border-color: $primary-color;
      }

      .message-avatar {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        background: rgba($primary-color, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: $primary-color;
          svg {
            width: 24px;
            height: 24px;
          }
        }
      }

      .message-content {
        flex: 1;
        min-width: 0;

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .message-sender {
            font-weight: 600;
            color: $text-light;
          }

          .message-time {
            font-size: 0.8rem;
            color: $text-muted;
          }
        }

        .message-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: $text-light;
        }

        .message-preview {
          color: $text-muted;
          font-size: 0.9rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .message-tags {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;

          .tag {
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 500;

            &.important {
              background: rgba($secondary-color, 0.2);
              color: $secondary-color;
            }

            &.project {
              background: rgba($accent-color, 0.2);
              color: $accent-color;
            }

            &.security {
              background: rgba(#ff9500, 0.2);
              color: #ff9500;
            }

            &.meeting {
              background: rgba(#9c27b0, 0.2);
              color: #9c27b0;
            }

            &.backup {
              background: rgba(#4caf50, 0.2);
              color: #4caf50;
            }

            &.code {
              background: rgba($primary-color, 0.2);
              color: $primary-color;
            }

            &.monitor {
              background: rgba(#607d8b, 0.2);
              color: #607d8b;
            }

            &.design {
              background: rgba(#e91e63, 0.2);
              color: #e91e63;
            }
          }
        }
      }

      .message-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        .message-type {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          &.system {
            background: rgba($secondary-color, 0.2);
            color: $secondary-color;
          }

          &.user {
            background: rgba($accent-color, 0.2);
            color: $accent-color;
          }

          svg {
            width: 16px;
            height: 16px;
          }
        }

        .unread-indicator {
          width: 8px;
          height: 8px;
          background: $primary-color;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
      }
    }

    .load-more {
      display: flex;
      justify-content: center;
      padding: 2rem 0;

      .load-more-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background: rgba($primary-color, 0.1);
        border: 1px solid rgba($primary-color, 0.3);
        border-radius: 25px;
        color: $primary-color;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba($primary-color, 0.2);
          transform: translateY(-2px);
        }

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;

      .empty-icon {
        width: 80px;
        height: 80px;
        background: rgba($primary-color, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        color: $primary-color;

        svg {
          width: 40px;
          height: 40px;
        }
      }

      .empty-text {
        font-size: 1.2rem;
        font-weight: 600;
        color: $text-light;
        margin-bottom: 0.5rem;
      }

      .empty-subtext {
        color: $text-muted;
        font-size: 0.9rem;
      }
    }
  }
}

// 装饰性元素
.decorative-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .tech-lines {
    position: absolute;
    width: 100%;
    height: 100%;

    .line {
      position: absolute;
      background: linear-gradient(90deg, transparent, $primary-color, transparent);
      opacity: 0.3;

      &.horizontal {
        height: 1px;
        width: 200px;
        animation: line-move-horizontal 8s ease-in-out infinite;

        &:nth-child(1) {
          top: 20%;
          animation-delay: 0s;
        }

        &:nth-child(2) {
          top: 50%;
          animation-delay: 2s;
        }

        &:nth-child(3) {
          top: 80%;
          animation-delay: 4s;
        }
      }

      &.vertical {
        width: 1px;
        height: 200px;
        background: linear-gradient(0deg, transparent, $accent-color, transparent);
        animation: line-move-vertical 10s ease-in-out infinite;

        &:nth-child(1) {
          left: 10%;
          animation-delay: 1s;
        }

        &:nth-child(2) {
          left: 50%;
          animation-delay: 3s;
        }

        &:nth-child(3) {
          left: 90%;
          animation-delay: 5s;
        }
      }
    }
  }

  .corner-decorations {
    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid $primary-color;
      opacity: 0.6;

      &.top-left {
        top: 2rem;
        left: 2rem;
        border-right: none;
        border-bottom: none;
      }

      &.top-right {
        top: 2rem;
        right: 2rem;
        border-left: none;
        border-bottom: none;
      }

      &.bottom-left {
        bottom: 2rem;
        left: 2rem;
        border-right: none;
        border-top: none;
      }

      &.bottom-right {
        bottom: 2rem;
        right: 2rem;
        border-left: none;
        border-top: none;
      }
    }
  }
}

// 动画
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(120deg); }
  66% { transform: translateY(5px) rotate(240deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

@keyframes line-move-horizontal {
  0%, 100% { left: -200px; }
  50% { left: calc(100% + 200px); }
}

@keyframes line-move-vertical {
  0%, 100% { top: -200px; }
  50% { top: calc(100% + 200px); }
}

// 响应式设计
@media (max-width: 768px) {
  .top-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;

    .header-left {
      width: 100%;
      justify-content: space-between;

      .breadcrumb {
        display: none;
      }
    }

    .header-right {
      width: 100%;
      justify-content: center;
    }
  }

  .message-filters {
    padding: 1rem;

    .filter-tabs {
      flex-wrap: wrap;
      gap: 0.5rem;

      .filter-tab {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }
    }
  }

  .messages-content {
    padding: 1rem;

    .message-item {
      padding: 1rem;
      gap: 0.75rem;

      .message-avatar {
        width: 40px;
        height: 40px;
      }

      .message-content {
        .message-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .message-tags {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>