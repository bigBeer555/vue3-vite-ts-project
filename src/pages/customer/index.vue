<template>
  <div class="im-page-container">
    <div class="im-layout">
      <!-- 左侧联系人列表 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="search-wrapper">
            <el-input 
              v-model="searchText" 
              placeholder="搜索联系人" 
              prefix-icon="Search" 
              class="search-input" 
              clearable
            />
          </div>
        </div>
        
        <div class="user-list custom-scrollbar">
          <div
            v-for="user in filteredUserList"
            :key="user.id"
            class="user-item"
            :class="{ active: currentChatUser?.id === user.id }"
            @click="selectUser(user)"
          >
            <div class="avatar-container">
              <el-badge :value="user.unread" :hidden="user.unread === 0" class="unread-badge" type="danger" :max="99">
                <el-avatar :size="44" :src="user.avatar" shape="square" class="user-avatar" />
              </el-badge>
            </div>
            <div class="user-info">
              <div class="info-top">
                <span class="name">{{ user.name }}</span>
                <span class="time">{{ formatTime(user.lastTime) }}</span>
              </div>
              <div class="info-bottom">
                <span class="last-msg">{{ user.lastMsg }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-area" v-if="currentChatUser">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="header-left">
            <span class="chat-title">{{ currentChatUser.name }}</span>
            <div class="status-indicator" :class="{ online: currentChatUser.online }">
              <span class="status-dot"></span>
              <span class="status-text">{{ currentChatUser.online ? '在线' : '离线' }}</span>
            </div>
          </div>
          <div class="header-right">
            <el-button :icon="More" circle text class="more-btn" />
          </div>
        </div>
        
        <!-- 消息列表 -->
        <div class="message-list custom-scrollbar" ref="messageListRef">
          <div v-for="(msg, index) in messageHistory" :key="msg.id" class="message-group">
            <!-- 时间分割线：如果当前消息距离上一条超过5分钟显示时间 -->
            <div v-if="shouldShowTime(msg, index)" class="time-separator">
              <span>{{ msg.time }}</span>
            </div>

            <div class="message-row" :class="{ 'me': msg.isMe }">
              <el-avatar v-if="!msg.isMe" :size="36" :src="currentChatUser.avatar" class="msg-avatar" shape="square" />
              
              <div class="msg-content-wrapper">
                 <div class="msg-bubble">
                   {{ msg.content }}
                 </div>
              </div>
              
              <el-avatar v-if="msg.isMe" :size="36" :src="myAvatar" class="msg-avatar" shape="square" />
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <div class="toolbar">
             <el-tooltip content="表情" placement="top" :show-after="500">
               <el-icon class="tool-icon"><Star /></el-icon>
             </el-tooltip>
             <el-tooltip content="发送图片" placement="top" :show-after="500">
               <el-icon class="tool-icon"><Picture /></el-icon>
             </el-tooltip>
             <el-tooltip content="发送文件" placement="top" :show-after="500">
               <el-icon class="tool-icon"><Folder /></el-icon>
             </el-tooltip>
             <!-- 占位，把历史记录推到右边 -->
             <div class="spacer"></div>
             <el-tooltip content="聊天记录" placement="top" :show-after="500">
               <el-icon class="tool-icon"><Clock /></el-icon>
             </el-tooltip>
          </div>
          
          <div class="input-wrapper">
            <el-input
              v-model="inputContent"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入消息..."
              class="msg-input"
              @keydown.enter.exact.prevent="sendMessage"
            />
          </div>
          
          <div class="action-bar">
            <span class="tip">按 Enter 发送，Ctrl + Enter 换行</span>
            <el-button type="primary" @click="sendMessage" :disabled="!inputContent.trim()" class="send-btn">发送</el-button>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <el-empty description=" " :image-size="200" />
          <p class="empty-text">选择一个联系人开始聊天</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted,onBeforeUnmount } from 'vue'
import { Picture, Folder, More, Star, Clock } from '@element-plus/icons-vue'
// @ts-ignore
import ws from '@/ws'

// --- 类型定义 ---
interface User {
  id: string
  name: string
  avatar: string
  lastMsg: string
  lastTime: string // 格式化后的时间字符串
  timestamp: number // 用于排序的时间戳
  unread: number
  online: boolean
}

interface Message {
  id: string
  content: string
  time: string
  timestamp: number
  isMe: boolean
  type: 'text' | 'image'
}

// --- 状态 ---
const searchText = ref('')
const inputContent = ref('')
const messageListRef = ref<HTMLElement | null>(null)
const myAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// 模拟联系人数据
const userList = reactive<User[]>([
  {
    id: '1',
    name: '客服小美',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    lastMsg: '您好，请问有什么可以帮您？',
    lastTime: '10:23',
    timestamp: Date.now() - 1000 * 60 * 5,
    unread: 2,
    online: true
  },
  {
    id: '2',
    name: '技术支持-张工',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    lastMsg: '这个问题我们需要排查一下日志，请稍等片刻。',
    lastTime: '昨天',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    unread: 0,
    online: false
  },
  {
    id: '3',
    name: '财务部',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    lastMsg: '发票已经寄出了，请注意查收。',
    lastTime: '周一',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    unread: 0,
    online: true
  }
])

const currentChatUser = ref<User | null>(null)
const messageHistory = ref<Message[]>([])

// --- 计算属性 ---
const filteredUserList = computed(() => {
  let list = userList
  if (searchText.value) {
    list = userList.filter(u => u.name.includes(searchText.value))
  }
  // 按时间倒序
  return list.sort((a, b) => b.timestamp - a.timestamp)
})

// --- 方法 ---
const selectUser = (user: User) => {
  currentChatUser.value = user
  user.unread = 0 // 清除未读
  loadHistoryMessages(user.id)
}

const loadHistoryMessages = (userId: string) => {
  // 模拟数据
  const now = Date.now()
  messageHistory.value = [
    { id: '1', content: '您好，在吗？', time: '10:20', timestamp: now - 1000 * 60 * 10, isMe: true, type: 'text' },
    { id: '2', content: '您好，客服小美为您服务。请问有什么问题？', time: '10:21', timestamp: now - 1000 * 60 * 9, isMe: false, type: 'text' },
    { id: '3', content: '我想咨询一下退款流程，操作稍微有点复杂。', time: '10:22', timestamp: now - 1000 * 60 * 8, isMe: true, type: 'text' },
    { id: '4', content: userId === '1' ? '好的，请提供订单号，我帮您查询一下。' : '请稍等...', time: '10:23', timestamp: now - 1000 * 60 * 5, isMe: false, type: 'text' }
  ]
  scrollToBottom()
}

const sendMessage = () => {
  const text = inputContent.value.trim()
  if (!text) return
  // 发送消息到服务器
  ws.sendMessage(JSON.stringify({
    type: 'chat',
    message: text
  }))
  
  const now = Date.now()
  // 添加发送消息
  messageHistory.value.push({
    id: now.toString(),
    content: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: now,
    isMe: true,
    type: 'text'
  })
  
  // 更新联系人最后一条消息
  // if (currentChatUser.value) {
  //   currentChatUser.value.lastMsg = text
  //   currentChatUser.value.lastTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //   currentChatUser.value.timestamp = now
  // }
  
  // inputContent.value = ''
  // scrollToBottom()
  
  // 模拟自动回复
  // setTimeout(() => {
  //   const replyText = '收到您的消息：' + text
  //   const replyTime = Date.now()
  //   messageHistory.value.push({
  //     id: replyTime.toString(),
  //     content: replyText,
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     timestamp: replyTime,
  //     isMe: false,
  //     type: 'text'
  //   })
    
  //   if (currentChatUser.value) {
  //     currentChatUser.value.lastMsg = replyText
  //     currentChatUser.value.lastTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //     currentChatUser.value.timestamp = replyTime
  //   }
    
  //   scrollToBottom()
  // }, 1000)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 辅助方法：格式化时间显示
const formatTime = (timeStr: string) => {
  return timeStr
}

// 辅助方法：判断是否显示时间（间隔超过5分钟）
const shouldShowTime = (msg: Message, index: number) => {
  if (index === 0) return true
  const prevMsg = messageHistory.value[index - 1]
  return prevMsg && msg.timestamp - prevMsg.timestamp > 5 * 60 * 1000
}

onMounted(() => {
  ws.onConnect()
  const first = userList[0]
  if (first) selectUser(first)
})
onBeforeUnmount(() => {
  ws.closeConnection()
})
</script>

<style lang="scss" scoped>
// 变量定义
$sidebar-bg: #f7f7f7;
$sidebar-hover: #e9e9e9;
$sidebar-active: #c6c6c6;
$border-color: #dcdfe6;
$primary-color: #409eff;
$chat-bg: #f5f5f5;
$msg-me-bg: #95ec69;
$msg-other-bg: #ffffff;
$text-main: #303133;
$text-secondary: #909399;

.im-page-container {
  width: 100%;
  height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.im-layout {
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 850px;
  max-height: 90vh;
  background-color: #fff;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

// --- 侧边栏样式 ---
.sidebar {
  width: 280px;
  background-color: $sidebar-bg;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    padding: 18px 12px;
    background-color: #f7f7f7; // 与列表背景一致或稍深
    
    .search-input {
      :deep(.el-input__wrapper) {
        background-color: #e2e2e2;
        box-shadow: none;
        border-radius: 4px;
        transition: all 0.2s;
        
        &.is-focus {
          background-color: #fff;
          box-shadow: 0 0 0 1px $border-color inset;
        }
      }
    }
  }

  .user-list {
    flex: 1;
    overflow-y: auto;
    
    .user-item {
      display: flex;
      padding: 12px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;

      &:hover {
        background-color: $sidebar-hover;
      }
      
      &.active {
        background-color: #e4e4e4;
        
        .user-info .info-top .name {
           font-weight: 600;
        }
      }

      .avatar-container {
        margin-right: 12px;
        flex-shrink: 0;
        
        .user-avatar {
          border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .unread-badge {
          :deep(.el-badge__content) {
            border: none;
            box-shadow: 0 0 0 1px #fff;
          }
        }
      }

      .user-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .info-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          
          .name {
            font-size: 14px;
            color: $text-main;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .time {
            font-size: 12px;
            color: $text-secondary;
            flex-shrink: 0;
            margin-left: 8px;
          }
        }
        
        .info-bottom {
          .last-msg {
            font-size: 12px;
            color: $text-secondary;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
          }
        }
      }
    }
  }
}

// --- 聊天区域样式 ---
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: $chat-bg;
  min-width: 0; // 防止flex子项溢出

  .chat-header {
    height: 60px;
    padding: 0 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    z-index: 10;

    .header-left {
      display: flex;
      align-items: center;
      
      .chat-title {
        font-size: 16px;
        font-weight: 600;
        color: $text-main;
        margin-right: 8px;
      }
      
      .status-indicator {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: $text-secondary;
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ccc;
          margin-right: 4px;
        }
        
        &.online {
          color: #67c23a;
          .status-dot {
            background-color: #67c23a;
          }
        }
      }
    }
    
    .more-btn {
      color: $text-secondary;
      &:hover {
        color: $text-main;
        background-color: rgba(0,0,0,0.05);
      }
    }
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .time-separator {
      text-align: center;
      margin: 10px 0;
      
      span {
        font-size: 12px;
        color: #b0b0b0;
        background-color: rgba(0,0,0,0.05);
        padding: 2px 8px;
        border-radius: 4px;
      }
    }

    .message-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      animation: fadeIn 0.3s ease;

      &.me {
        justify-content: flex-end;
        
        .msg-content-wrapper {
          align-items: flex-end;
          
          .msg-bubble {
            background-color: $msg-me-bg;
            color: #000;
            
            &::after {
              content: "";
              position: absolute;
              right: -6px;
              top: 10px;
              width: 0;
              height: 0;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              border-left: 6px solid $msg-me-bg;
            }
          }
        }
        
        .msg-avatar {
          margin-left: 12px;
          margin-right: 0;
        }
      }

      .msg-avatar {
        flex-shrink: 0;
        margin-right: 12px;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,0.05);
      }

      .msg-content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 70%;
        position: relative;
        
        .msg-bubble {
          padding: 10px 14px;
          background-color: $msg-other-bg;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.6;
          color: $text-main;
          word-break: break-all;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          position: relative;
          
          &:not(.me .msg-bubble)::before {
            content: "";
            position: absolute;
            left: -6px;
            top: 10px;
            width: 0;
            height: 0;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-right: 6px solid $msg-other-bg;
          }
        }
      }
    }
  }

  .chat-input-area {
    height: 180px;
    background-color: #fff;
    border-top: 1px solid $border-color;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    .toolbar {
      padding: 10px 20px;
      display: flex;
      gap: 18px;
      align-items: center;
      
      .tool-icon {
        font-size: 20px;
        color: #606266;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          color: $primary-color;
          transform: scale(1.1);
        }
      }
      
      .spacer {
        flex: 1;
      }
    }

    .input-wrapper {
      flex: 1;
      padding: 0 20px;
      
      :deep(.el-textarea__inner) {
        border: none;
        box-shadow: none;
        padding: 0;
        background-color: transparent;
        resize: none;
        font-size: 14px;
        line-height: 1.5;
        color: $text-main;
        
        &:focus {
          box-shadow: none;
        }
        
        // 自定义滚动条
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: #e0e0e0;
        }
      }
    }

    .action-bar {
      padding: 10px 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      
      .tip {
        font-size: 12px;
        color: #999;
        margin-right: 15px;
      }
      
      .send-btn {
        width: 80px;
      }
    }
  }
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $chat-bg;
  
  .empty-content {
    text-align: center;
    .empty-text {
      color: $text-secondary;
      font-size: 14px;
      margin-top: -20px;
    }
  }
}

// 通用自定义滚动条
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #dcdcdc;
    
    &:hover {
      background-color: #c0c0c0;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>