import jwt from 'jsonwebtoken'
import type { Model } from 'mongoose'
import type { Request, Response, NextFunction } from 'express'

declare module 'express' {
  interface Request {
    user?: any
  }
}

const JWT_SECRET = '123123123123123'

// 生成 token
export async function generateToken(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' })
  return token
}

// 验证 token
export async function verifyToken<T>(token: string, tokenModel: Model<T>) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // 检查 MongoDB 中的 token 状态
    const tokenDoc = await tokenModel.findOne({ token, isRevoked: false })
    if (!tokenDoc) {
      throw new Error('Token not found or revoked')
    }
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return decoded.userId
    }
    throw new Error('Invalid token payload')
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// 使用中间件验证 token，在一些需要验证token的接口上进行添加
export async function authMiddleware<T, U>(
  req: Request,
  res: Response,
  next: NextFunction,
  tokenModel: Model<T>,
  userModel: Model<U>
) {
  // 从请求头获取 token
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const userId = await verifyToken(token, tokenModel)
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// 登出（撤销 token）
export async function revokeToken<T>(token: string, tokenModel: Model<T>) {
  await tokenModel.findOneAndUpdate({ token }, { isRevoked: true })
}

module.exports = { generateToken, verifyToken, authMiddleware, revokeToken }
