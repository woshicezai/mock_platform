// apiRoutes.js
const express = require("express");
const router = express.Router();

router.post("/submit", (req, res) => {
  // 访问请求体中的数据
  const data = req.body;
  // 可以在这里处理数据...（例如保存到数据库等）

  // 发送一个响应回客户端
  res.status(200).json({
    message: "Data received!",
    dataReceived: data,
  });
});

// 导出路由器
module.exports = router;
