// 导入Express模块
const express = require("express");
const cors = require("cors");

const apiRouters = require("./routers/api");
const submitRouters = require("./routers/submit");
// 创建一个Express应用
const app = express();

//解决请求跨域
const corsOptions = {
  origin: "http://localhost:5173", // 只允许端口5173的请求
  optionsSuccessStatus: 200, // 一些旧版浏览器不支持默认的204状态码
};
app.use(cors(corsOptions));

// 使用JSON解析中间件
app.use(express.json());

// 请求的路由
app.use("/api", apiRouters);
app.use("/submit", submitRouters);

// 定义服务器要监听的端口
const PORT = 3000;

// 使应用监听指定端口并启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
