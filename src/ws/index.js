const PING = 'ping'
const PONG = 'pong'
const HEARTBEAT_INTERVAL = 10000
const HEARTBEAT_TIMEOUT = 5000
const RECONNECT_BASE_DELAY = 1000
const RECONNECT_MAX_DELAY = 30000

let ws = null
let heartbeatTimer = null
let heartbeatTimeoutTimer = null
let reconnectTimer = null
let reconnectAttempts = 0
let manualClose = false

const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

const scheduleReconnect = () => {
  if (manualClose || reconnectTimer) return
  const expDelay = RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttempts)
  const delay = Math.min(expDelay, RECONNECT_MAX_DELAY)
  const jitter = Math.floor(Math.random() * 300)
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    reconnectAttempts += 1
    onConnect()
  }, delay + jitter)
}
// 建立 WebSocket 连接并绑定事件
const onConnect = () => {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return
  manualClose = false
  ws = new WebSocket('ws://localhost:3003/ws')
  ws.onopen = () => {
    reconnectAttempts = 0
    clearReconnectTimer()
    console.log('连接成功')
    startHeartbeat()
  }
  ws.onmessage = (event) => {
    const raw = JSON.parse(event.data)
    if (raw.type === PONG) {
      if (heartbeatTimeoutTimer) {
        clearTimeout(heartbeatTimeoutTimer)
        heartbeatTimeoutTimer = null
      }
      console.log('收到心跳响应')
      return
    }
    console.log(`收到消息: ${event.data}`)
  };
  ws.onclose = () => {
    clearHeartbeat()
    ws = null
    console.log('连接已关闭')
    scheduleReconnect()
  };
  ws.onerror = (error) => {
    clearHeartbeat()
    console.log('连接失败', error)
    if (ws) {
      ws.close()
    }
  }
}
// 清理心跳定时器和超时定时器
const clearHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
  if (heartbeatTimeoutTimer) {
    clearTimeout(heartbeatTimeoutTimer)
    heartbeatTimeoutTimer = null
  }
}

// 重置单次心跳等待超时，超时后主动断开连接
const resetHeartbeatTimeout = () => {
  if (heartbeatTimeoutTimer) {
    clearTimeout(heartbeatTimeoutTimer)
  }
  heartbeatTimeoutTimer = setTimeout(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close()
    }
    console.log('心跳超时，连接已关闭')
  }, HEARTBEAT_TIMEOUT)
}

// 启动周期心跳，定时发送 ping 并开启超时检测
const startHeartbeat = () => {
  clearHeartbeat()
  heartbeatTimer = setInterval(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: PING }))
    resetHeartbeatTimeout()
  }, HEARTBEAT_INTERVAL)
}

// 发送业务消息到服务端
const sendMessage = (message) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log('连接未建立')
    return
  }
  ws.send(message)
}

// 关闭连接并清理心跳资源
const closeConnection = () => {
  manualClose = true
  reconnectAttempts = 0
  clearReconnectTimer()
  clearHeartbeat()
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close()
    return
  }
  if (ws && ws.readyState === WebSocket.CONNECTING) {
    ws.close()
    return
  }
  ws = null
}

export default {
    onConnect,
    sendMessage,
    closeConnection,
}
