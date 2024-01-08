import axios from 'axios'

const httpInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: import.meta.env.VITE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

async function get<T>(url: string, params = {}): Promise<T> {
  const response = await httpInstance.get(url, {
    params
  })
  return response.data
}

async function post<T, R>(url: string, data: T): Promise<R> {
  const response = await httpInstance.post(url, {
    data
  })
  return response.data
}

export { get, post }
