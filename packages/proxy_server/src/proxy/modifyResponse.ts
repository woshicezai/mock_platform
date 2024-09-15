import { URLModel,TokenModel } from '../database/model'
import SocketServer from '../utils/socketServer'
import { findTokenByClientId, verifyToken } from '../utils/token'

import type { Request } from 'express'
/**
 * 修改返回的响应体
 * TODO: 转换的方式目前过于粗糙
 * @param {*} response
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modifyResponseToString = async (req: Request, response: any) => {
  try {
    const url = req.originalUrl || req.url
    //通过clientId找到token
    const clientId = req.headers['x-client-id'] as string
    const token = await findTokenByClientId(clientId, TokenModel)
    //通过token找到userId
    const userId = await verifyToken(token, TokenModel)
    const data = await URLModel.findOne({ userId, url, isProxy: true }, 'data', {
      lean: true
    })
    if (data) {
      //说明查到符合url的代理数据了
      SocketServer.send('data', token, {
        url,
        data: data.data,
        isProxy: true,
        title: '返回的数据',
        editable: true
      })
      return JSON.stringify(data.data)
    } else {
      //没有查到，说明没有做过代理配置，则将目标服务器的响应返回去
      SocketServer.send('data', token, {
        url,
        data: JSON.parse(response),
        isProxy: false,
        title: '返回的数据-没查到',
        editable: true
      })
      return response
    }
  } catch (error) {
    return response
  }
}
