// proxyClientRouter.js
import express from 'express'
import { URLModel, TokenModel, UserModel } from '../database/model'
import { authMiddleware } from '../utils/token'
import type { IAuthenticatedRequest } from '../utils/token'

const router = express.Router()
//TODO: 这个中间件是只影响 当前的 proxyClientRouter吗？
router.use(authMiddleware(TokenModel, UserModel))

/**
 * 保存编辑后的代理配置数据
 */
router.post('/save', async (req: IAuthenticatedRequest, res) => {
  try {
    const { data = {} } = req.body
    const result = await URLModel.updateOne(
      { userId: req.user?.userId, url: data.url },
      { $set: { ...data, date: Date.now() } },
      { upsert: true }
    ).exec()
    console.log('save-success', result)
    res.send(result.acknowledged)
  } catch (e) {
    console.log('save-fail', e)
    res.status(500).send(false)
  }
})

/**
 * 删除操作：对于url进行删除
 */
router.post('/deleteByUrl', async (req: IAuthenticatedRequest, res) => {
  const { data = {} } = req.body
  const result = await URLModel.deleteMany({ userId: req.user?.userId, url: data.url }).exec()
  console.log('deleteByUrl-success', result)
  res.send(result.acknowledged)
})

export default router
