import { URLModel } from '../database/model'

import SocketServer from '../socketServer'

/**
 * 修改返回的响应体
 * TODO: 转换的方式目前过于粗糙
 * @param {*} response
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modifyResponseToString = async (url: string, response: any) => {
  try {
    const data = await URLModel.findOne({ url, isProxy: true }, 'data', {
      lean: true
    })
    if (data) {
      //说明查到符合url的数据了
      SocketServer.send('data', data.data)
      return JSON.stringify(data.data)
    } else {
      SocketServer.send('data', JSON.parse(response))
      return response
    }
  } catch (error) {
    return response
  }
}
