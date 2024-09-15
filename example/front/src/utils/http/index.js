import axios from 'axios'
import proxyConfig from './proxy'

const httpInstance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: import.meta.env.VITE_PROXY_BASE_URL, //代理服务器域名
  timeout: import.meta.env.VITE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-target-host': import.meta.env.VITE_BASE_URL,
    'x-client-id':'e1e468254abc0db'
  }
})

export const get = async (url, params = {}) => {
  const response = await httpInstance.get(url, {
    baseURL: proxyConfig.getProxy()
      ? import.meta.env.VITE_PROXY_BASE_URL
      : import.meta.env.VITE_BASE_URL,
    params
  })
  return response.data
}

export const post = async (url = '', data = {}) => {
  const response = await httpInstance.post(url, {
    baseURL: proxyConfig.getProxy()
      ? import.meta.env.VITE_PROXY_BASE_URL
      : import.meta.env.VITE_BASE_URL,
    data
  })
  return response.data
}
