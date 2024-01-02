import axios from 'axios'

const httpInstance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: import.meta.env.VITE_PROXY_BASE_URL, //代理服务器域名
  timeout: import.meta.env.VITE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-target-host': import.meta.env.VITE_BASE_URL
  }
})

export const get = async (url, params = {}) => {
  const response = await httpInstance.get(url, {
    params
  })
  return response.data
}

export const post = async (url = '', data = {}) => {
  const response = await httpInstance.post(url, {
    data
  })
  return response.data
}
