/**
 * 用户表
 */
import express from 'express'
import { UserModel } from '../database/model'

const router = express.Router()

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { username, password, phone } = req.body
    // 创建新用户
    const user = new UserModel({ username, password, phone })
    await user.save()
    res.status(201).json({ message: '用户注册成功' })
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
    const { username, password } = req.body
    const user = await UserModel.findOne({ username })

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: '密码错误' })
    }

    // 登录成功
    res.status(200).json({ message: '登录成功', userId: user._id })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
})

export default router
