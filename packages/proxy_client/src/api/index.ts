import { post, get } from 'utils/request'
import type { TProxyInfo } from 'commonTypes/socket'

export function saveProxyInfo(info: TProxyInfo) {
  return post<TProxyInfo, Boolean>('/save', info)
}

export function delProxyInfo(info: TProxyInfo) {
  return post<TProxyInfo, Boolean>('/deleteByUrl', info)
}
