import Redis from 'ioredis'
import type { Request, Response, NextFunction } from 'express'
import { HTTP_NO_VALID_TOKEN_CODE } from '../const'

const EXPIRE_TIME = 86400 // 1天过期

const redis = new Redis()

declare module 'express' {
  interface Request {
    token?: any
  }
}

/**
 * 存储客户端id和token的映射关系
 * TODO: 过期时间是否改为1h？和token一致
 * @param clientId
 * @param token
 */
export async function storeClientIdMapping(clientId: string, token: string) {
  await redis.set(`client:${clientId}`, token, 'EX', EXPIRE_TIME) // 1天过期
}

/**
 * 从客户端id获取token
 * @param clientId
 * @returns
 */
async function getTokenFromClientId(clientId: string) {
  return await redis.get(`client:${clientId}`)
}

/**
 * 使用中间件验证客户端id
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function authenticateClientIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const clientId = req.headers['client-id']
  const token = await getTokenFromClientId(clientId as string)
  if (!token) {
    return res.status(HTTP_NO_VALID_TOKEN_CODE).json({ message: 'No token provided' })
  }
  req.token = token
  next()
}
