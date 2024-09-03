/**
 * 用户表
 */
import express from 'express'
import { UserModel, TokenModel } from '../database/model'
import { generateHash, generateKeyPair, decryptPassword } from '../utils/crypto'
import { generateToken } from '../utils/token'

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
    // 存储到 MongoDB
    await TokenModel.create({
      userId: user._id,
      token
    })
    // 登录成功
    res.status(200).json({ code: 0, message: '登录成功', userId: user._id, token })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
})

export default router
