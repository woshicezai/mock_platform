import axios from 'axios'

const httpInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: import.meta.env.VITE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * todo: 添加token
 * @param config
 * @returns
 */
httpInstance.interceptors.request.use((config) => {
  return config
})

/**
 * 响应拦截器
 * @param response
 * @returns
 */
httpInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 服务器返回了非2xx的状态码
      console.error('Server Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('Network Error:', error.message)
    } else {
      // 在设置请求时发生了一些事情，触发了错误
      console.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  }
)

async function handleResponse<T>(response: AxiosResponse<CustomResponse<T>>): Promise<T> {
  const { data } = response
  if (data.code !== 0) {
    // 业务逻辑错误
    throw new Error(data.message)
  }
  return data
}

async function get<T>(url: string, params = {}): Promise<T> {
  const response = await httpInstance.get(url, params)
  return await handleResponse(response)
}

async function post<T, R>(url: string, data: T): Promise<R> {
  const response = await httpInstance.post(url, data)
  return await handleResponse(response)
}

export { get, post }
