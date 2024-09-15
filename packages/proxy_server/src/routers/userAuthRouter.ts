/**
 * 用户表
 */
import express from 'express'
import { UserModel, TokenModel } from '../database/model'
import { generateHash, generateKeyPair, decryptPassword, generateClientId } from '../utils/crypto'
import { generateToken, revokeToken,deleteTokenByUserId } from '../utils/token'

import { HTTP_NO_VALID_TOKEN_CODE } from '../const'

const router = express.Router()

const { publicKey, privateKey } = generateKeyPair()

//获取公钥
router.get('/getPublicKey', (req, res) => {
  res.status(200).json({
    code: 0,
    data: {
      key: publicKey
    }
  })
})

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { username, password: encryptedPassword, phone } = req.body
    //先解密密码
    const decryptedPassword = decryptPassword(encryptedPassword, privateKey)
    console.log('decryptedPassword', decryptedPassword)
    //明文密码进行hash加密
    const hashedPassword = await generateHash(decryptedPassword)
    // 创建新用户
    const user = new UserModel({ username, password: hashedPassword, phone })
    await user.save()
    res.status(200).json({ code: 0, message: '用户注册成功' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
})
// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password: encryptedPassword } = req.body
    // 1. 解密密码
    const decryptedPassword = decryptPassword(encryptedPassword, privateKey)

    const user = await UserModel.findOne({ username })

    if (!user) {
      return res.status(200).json({ code: 1, message: '用户不存在' })
    }

    const isPasswordValid = await user.comparePassword(decryptedPassword)
    if (!isPasswordValid) {
      return res.status(200).json({ code: 1, message: '密码错误' })
    }
    // 生成token
    const token = await generateToken(user._id)
    //生成 clientId
    const clientId = generateClientId(token)
    // TokenModel 删除掉 之前的 token
    await deleteTokenByUserId(user._id, TokenModel)
    // 存储到 MongoDB
    await TokenModel.create({
      userId: user._id,
      token,
      clientId
    })
    // 登录成功
    res.status(200).json({ code: 0, message: '登录成功', token, clientId })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
})

// 登出接口
router.post('/logout', async (req, res) => {
  // 从请求头获取 token
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  if (!token) {
    return res.status(HTTP_NO_VALID_TOKEN_CODE).json({ message: 'No token provided' })
  }
  await revokeToken(token, TokenModel)
  res.status(200).json({ code: 0, message: '登出成功' })
})

export default router
