// apiRoutes.js
const express = require('express')
const router = express.Router()

// 假设我们有一些API端点
router.get('/hello', (req, res) => {
  res.json({ message: 'hello world' })
})

router.get('/bye', (req, res) => {
  res.json({ message: 'bye bye' })
})

router.get('/user', (req, res) => {
  res.json({ name: 'recher', age: 30, addr: '北京市' })
})

router.get('/users', (req, res) => {
  res.json([
    { name: 'user1', age: 20, addr: '北京市' },
    { name: 'user2', age: 30, addr: '天津市' }
  ])
})

// 导出路由器
module.exports = router
