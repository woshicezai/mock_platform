// proxyClientRouter.js
import express from 'express'
import { URLModel } from '../database/model'

const router = express.Router()

/**
 * 获取所有url的代理配置数据
 */
router.get('/getProxyInfoList', async (req, res) => {
  const list = await URLModel.find({})
  res.send(list)
})

/**
 * 保存编辑后的代理配置数据
 */
router.post('/save', async (req, res) => {
  try {
    const { data = {} } = req.body
    await URLModel.findByIdAndUpdate(
      data._id,
      {
        ...data,
        date: Date.now()
      },
      { new: true }
    )
    res.send(true)
  } catch (e) {
    console.log('save-fail', e)
    res.status(500).send(false)
  }
})

router.post('/add', async (req, res) => {
  // 你的逻辑代码
  const urlModel = new URLModel({
    title: '测试一下',
    author: 'zhouce',
    url: 'add',
    data: {
      name: 'zhouce',
      age: 33
    },
    isProxy: true
  })
  try {
    const result = await urlModel.save()
    res.send('POST request received at /proxy-client' + result)
  } catch (error) {
    console.error(error)
  }
})

router.post('/delete', async (req, res) => {
  const { data = {} } = req.body
  console.log('delete', data)
  const result = await URLModel.findByIdAndDelete(data._id)
  res.send(result)
})

export default router
