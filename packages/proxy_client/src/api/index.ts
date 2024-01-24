import { post, get } from 'utils/request'
import type { TProxyInfo } from 'types/proxyInfo'

export function getProxyInfoList() {
  return get<TProxyInfo[]>('/getProxyInfoList', {})
}

export function saveProxyInfo(info: TProxyInfo) {
  return post<TProxyInfo, Boolean>('/save', info)
}

export function delProxyInfo(info: TProxyInfo) {
  return post<TProxyInfo, Boolean>('/delete', info)
}
