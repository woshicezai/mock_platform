// 导入Express模块
import express from 'express'
import cors from 'cors'
import { modifyResponseToString } from './modifyResponse'
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Options } from 'http-proxy-middleware/dist/types.d.ts'

const options: Options = {
  // target: 'http://localhost:3000', // 默认的目标服务器地址
  router(req) {
    // 你想要代理到的目标服务器地址，根据请求动态配置
    const targetHost = req.headers['x-target-host'] || ''
    return targetHost as string
  },
  changeOrigin: true,
  selfHandleResponse: true,
  pathRewrite: {
    // "^/api": "/", // 重写请求路径
  },
  onProxyRes: function (proxyRes, req, res) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalBody: any[] = []
    proxyRes.on('data', (chunk) => {
      originalBody.push(chunk)
    })
    proxyRes.on('end', () => {
      // Combine the body chunks to create the full body
      const bodyString = Buffer.concat(originalBody).toString()
      // Modify the response here
      const modifiedBody = modifyResponseToString(bodyString) // Assume modifyResponse is your custom function
      console.log('modifiedBody ', bodyString, modifiedBody)
      // You may need to adjust the content-length header if the body length has changed
      res.setHeader('Content-Length', Buffer.byteLength(modifiedBody))
      // Send the modified body
      res.end(modifiedBody)
    })

    // It's important to remove the content-encoding header if the response is compressed,
    // since the body modifications will change the content.
    if (proxyRes.headers['content-encoding']) {
      delete proxyRes.headers['content-encoding']
    }

    // To prevent the `http-proxy-middleware` from automatically sending the response,
    // we need to remove the `content-length` header and pause the proxy response.
    delete proxyRes.headers['content-length']
    // proxyRes.pause();
  },
  onError: function (err, req, res) {
    // 错误处理
    // res.status(500).send("Proxy Error");
    console.log('onError', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Proxy error' })
    }
  }
}

// 创建一个Express应用
const app = express()

//解决请求跨域
// const corsOptions = {
//   origin: "http://localhost:5173", // 只允许端口5173的请求
//   optionsSuccessStatus: 200, // 一些旧版浏览器不支持默认的204状态码
// };
app.use(cors())

app.use('/*', createProxyMiddleware(options))

// 定义服务器要监听的端口
const PORT = 4000

// 使应用监听指定端口并启动服务器
app.listen(PORT, () => {
  console.log(`Proxy Server is running on http://localhost:${PORT}`)
})
