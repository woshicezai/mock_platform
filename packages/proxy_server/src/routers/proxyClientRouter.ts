// proxyClientRouter.js
import express from 'express'
import { URLModel } from '../database/model'
const router = express.Router()

/**
 * 获取所有url的代理配置数据
 */
router.get('/getProxyInfoList', async (req, res) => {
  const list = await URLModel.find({}).exec()
  res.send(list)
})

/**
 * 保存编辑后的代理配置数据
 * TODO: 还得是当前用户下的数据
 */
router.post('/save', async (req, res) => {
  try {
    const { data = {} } = req.body
    const result = await URLModel.updateOne(
      { url: data.url },
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
 * TODO: 还得是当前用户下的数据
 */
router.post('/deleteByUrl', async (req, res) => {
  const { data = {} } = req.body
  const result = await URLModel.deleteMany({ url: data.url }).exec()
  console.log('deleteByUrl-success', result)
  res.send(result.acknowledged)
})

export default router
