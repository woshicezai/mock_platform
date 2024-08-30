import { post } from 'utils/request'

interface UserAuthData {
  phone: string
  password: string
}

interface AuthResponse {
  message: string
  userId?: string
}

export function login(data: UserAuthData) {
  return post<UserAuthData, AuthResponse>('/login', data)
}

export function register(data: UserAuthData) {
  return post<UserAuthData, AuthResponse>('/register', data)
}
