import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    baseURL: '/api', // 所有请求自动加上 /api 前缀，触发 vite 代理
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  // 请求拦截器
  service.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token')
    if (token&&config.headers) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    // 在发送请求之前做些什么
    return config;
  }, (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  
  // 响应拦截器
  service.interceptors.response.use((response: any) => {
    const res = response.data;

    // 兼容处理：如果没有 code 字段，或者 code 为 200，视为成功
    // 注意：有些接口可能不返回 code 直接返回数据，这里默认放行
    // 如果明确返回了 code 且不为 200，则视为业务错误
    if (res.code !== undefined && res.code !== 200) {
      const msg = res.msg || res.message || '请求失败';
      ElMessage.error(msg);
      // 返回 reject，这样业务侧的 await 就会抛出异常，阻止后续代码执行
      return Promise.reject(new Error(msg));
    }

    // 您的后端可能返回结构是 { code: 200, data: ..., msg: ... }
    // 这里直接返回 response.data，让调用方去判断 code
    return response.data;
  },
  (error: any) => {
    console.error('Request Error:', error);
    let message = error.message || '请求失败';
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          // 可以在这里处理登出逻辑
          // localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `连接错误 ${error.response.status}`;
      }
    }
    
    ElMessage.error(message);
    return Promise.reject(error)
  }
)
// 导出通用请求方法
const request = <T = any>(config: any): Promise<T> => {
    return service(config).then(res => res as T)
}

export default request;