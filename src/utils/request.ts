import axios from 'axios'
const service = axios.create({
    timeout: 5000,
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
    if(res.code === 200) {
        return response;
    }else {
        return Promise.reject(res.msg)
    }
  },
  (error: any) => {
    return Promise.reject(error)
  }
)
// 导出通用请求方法
const request = <T = any>(config: any): Promise<T> => {
    return service(config).then(res => res as T)
}

export default request;