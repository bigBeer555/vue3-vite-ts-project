<template>
  <div class="ai-chat-wrapper">
    <!-- 悬浮按钮 -->
    <button class="chat-trigger-btn" @click="toggleChat" :class="{ 'active': isOpen }">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12C2,14.25 2.73,16.3 3.96,18C3.12,19.96 2.19,21.03 2.15,21.07L2,21.24L2.18,21.39C2.23,21.43 3.61,22.61 6.55,21.33C8.16,21.77 9.87,22 11.63,22H12A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20C11.6,20 11.2,19.96 10.8,19.9L10.39,19.82L10,19.92C7.94,20.5 6.44,20.18 5.64,19.87C6.34,18.84 6.78,17.5 6.8,17.47L6.96,17.06L6.64,16.73C5.62,15.65 5,14.18 5,12.56V12A8,8 0 0,1 12,4M8.5,11A1.5,1.5 0 0,0 7,12.5A1.5,1.5 0 0,0 8.5,14A1.5,1.5 0 0,0 10,12.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 14,12.5A1.5,1.5 0 0,0 15.5,14A1.5,1.5 0 0,0 17,12.5A1.5,1.5 0 0,0 15.5,11Z" />
      </svg>
      <span class="btn-text">AI 助手</span>
    </button>

    <!-- 聊天窗口 -->
    <Teleport to="body">
      <transition name="chat-slide">
        <div class="chat-window-container" v-if="isOpen">
          <div class="chat-window-resizable">
            <div class="chat-window">
            <div class="chat-header">
              <div class="header-info">
                <div class="ai-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A2,2 0 0,1 14,8A2,2 0 0,1 12,10A2,2 0 0,1 10,8A2,2 0 0,1 12,6M12,14C14.67,14 17,15.34 17,17V18H7V17C7,15.34 9.33,14 12,14Z" />
                  </svg>
                </div>
                <span class="title">智能助手</span>
              </div>
              <button class="close-btn" @click="isOpen = false">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>

            <div class="chat-messages" ref="messagesContainer">
              <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="msg.type">
                <div class="message-content">
                  {{ msg.content }}
                </div>
              </div>
              <div class="message-item ai" v-if="isTyping">
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>

            <div class="chat-input-area">
              <textarea 
                v-model="inputMessage" 
                @keydown.enter.prevent="sendMessage"
                placeholder="输入问题，按回车发送..."
                rows="1"
              ></textarea>
              <button class="send-btn" @click="sendMessage" :disabled="!inputMessage.trim() || isTyping">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
              </button>
            </div>
          </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

const isOpen = ref(false);
const inputMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

interface Message {
  type: 'user' | 'ai';
  content: string;
}


const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = 'https://kfc-api.sxxe.net/v1';
const messages = ref<Message[]>([
  { type: 'ai', content: '您好！我是您的智能助手，有什么可以帮您的吗？' }
]);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(() => isOpen.value, (val) => {
  if (val) scrollToBottom();
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return;

  if (!apiKey) {
    messages.value.push({ type: 'ai', content: 'API Key 未配置（VITE_API_KEY）' });
    scrollToBottom();
    return;
  }

  const userMsg = inputMessage.value.trim();
  messages.value.push({ type: 'user', content: userMsg });
  inputMessage.value = '';
  scrollToBottom();

  isTyping.value = true;

  const model = 'gpt-5.3-codex';
  const isCodex = model.toLowerCase().includes('codex');
  const endpoint = isCodex ? '/responses' : '/chat/completions';
  const mappedMessages = [
    { role: 'system', content: '你是一个专业前端工程师' },
    { role: 'user', content: userMsg }
  ];
  const requestBody = isCodex
    ? { model, input: mappedMessages, stream: false, temperature: 0.7 }
    : { model, messages: mappedMessages, stream: false, temperature: 0.7 };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const errorText = await response.text();
      messages.value.push({
        type: 'ai',
        content: `请求失败(${response.status})：接口返回非 JSON：${errorText.slice(0, 200)}`
      });
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      messages.value.push({
        type: 'ai',
        content: `请求失败(${response.status})：${data?.error?.message || 'AI 接口报错'}`
      });
      return;
    }

    const aiContent =
      (Array.isArray(data?.output)
        ? data.output
            .filter((item: any) => item?.type === 'message' && Array.isArray(item?.content))
            .flatMap((item: any) => item.content)
            .map((c: any) => c?.text || '')
            .join('')
            .trim()
        : '') ||
      (typeof data?.output_text === 'string' ? data.output_text.trim() : '') ||
      (typeof data?.choices?.[0]?.message?.content === 'string' ? data.choices[0].message.content : '') ||
      '';

    messages.value.push({
      type: 'ai',
      content: aiContent ? aiContent : '（空回复）'
    });
  } catch (error: any) {
    messages.value.push({
      type: 'ai',
      content: `请求失败：${error?.message || '未知错误'}`
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }

  // 模拟AI回复
  // setTimeout(() => {
  //   isTyping.value = false;
  //   messages.value.push({ 
  //     type: 'ai', 
  //     content: `收到您的问题："${userMsg}"。这是一个模拟的AI回复，您可以在这里接入真实的LLM API。` 
  //   });
  //   scrollToBottom();
  // }, 1500);
};
</script>

<style scoped lang="scss">
.ai-chat-wrapper {
  position: relative;
  z-index: 1000;
}

.chat-trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.2); // Indigo with opacity
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover, &.active {
    background: #6366f1;
    color: white;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
  }
}

.chat-window-container {
  position: fixed;
  top: 70px;
  right: 20px;
  z-index: 9999;
}

.chat-window-resizable {
  width: 350px;
  height: 500px;
  background: rgba(15, 23, 42, 0.95); // Slate-900
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  resize: both;
  min-width: 320px;
  min-height: 420px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 100px);
  overflow: auto;
}

.chat-window {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: top right;
}

.chat-header {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .header-info {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .ai-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      
      svg { width: 20px; height: 20px; }
    }

    .title {
      font-weight: 600;
      color: #f8fafc;
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
    
    &:hover { color: white; }
    svg { width: 20px; height: 20px; }
  }
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.message-item {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  &.ai {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
    border-bottom-left-radius: 4px;
  }

  &.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-bottom-right-radius: 4px;
  }
}

.chat-input-area {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);

  textarea {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    resize: none;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: #6366f1;
    }
    
    &::placeholder {
      color: #64748b;
    }
  }

  .send-btn {
    background: #6366f1;
    border: 1px solid transparent;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    &:hover:not(:disabled) {
      background: #4f46e5;
    }

    &:disabled {
      background: rgba(99, 102, 241, 0.25);
      border-color: rgba(255, 255, 255, 0.12);
      cursor: not-allowed;
      opacity: 1;
    }

    svg { width: 18px; height: 18px; }
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

// Vue Transition
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
