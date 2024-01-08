// 导入Express模块
import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import proxyOptions from './proxy/options'
import proxyFilter from './proxy/filter'
import proxyClientRouter from './routers/proxyClientRouter'
import dataBaseConnect from './database/index'
import { PORT, PREFIX_PROXY_NAME } from './const'

// 创建一个Express应用
const app = express()

// 解析JSON格式的请求体
app.use(express.json())

// 解析URL-encoded格式的请求体
app.use(express.urlencoded({ extended: true }))

//连接数据库
dataBaseConnect()

//解决请求跨域
// const corsOptions = {
//   origin: "http://localhost:5173", // 只允许端口5173的请求
//   optionsSuccessStatus: 200, // 一些旧版浏览器不支持默认的204状态码
// };
app.use(cors())

//探针使用，看当前服务是否存活
app.get('/', function (req, res) {
  res.json({ message: '代理服务器请求正常' })
})
//代理所有请求，如果是根路径或以/proxy-client开头的路径，不进行代理
app.use(createProxyMiddleware(proxyFilter(PREFIX_PROXY_NAME), proxyOptions))
//代理前端页面的请求处理
app.use(`/${PREFIX_PROXY_NAME}`, proxyClientRouter)

// 使应用监听指定端口并启动服务器
app.listen(PORT, () => {
  console.log(`Proxy Server is running on http://localhost:${PORT}`)
})
