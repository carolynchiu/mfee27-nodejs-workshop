const express = require("express");
// 初始化dotenv
require("dotenv").config();
//// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();

// 在程式碼中，不要讓某些常數散亂在專案的各處
// 至少在同一個檔案中，可以放到最上方統一管理
// 目標是: 只需要改一個地方，全部的地方就生效
// 降低漏改到的風險 -> 降低程式出錯的風險
// 用 || 建立預設值
const port = process.env.SERVER_PORT || 3002;

// npm i cors
const cors = require("cors");
app.use(cors());

// 使用資料庫
// 查看 -> stock-be > utils > db.js
const pool = require("./utils/db");

// 一般的 middleware (中間件)
app.use((req, res, next) => {
  // console.log("這是middleware A");
  let now = new Date();
  console.log("這是middleware A", `有人來訪囉 ${now}`);
  next();
  // next() 一定要寫，讓 express 知道要跳去下一個中間件
});

app.use((req, res, next) => {
  console.log("這是middleware B");
  next();
  // next() 一定要寫，讓 express 知道要跳去下一個中間件
  // 沒有寫網頁會一直轉圈圈
});

// app.[method]
// method: get, post, delete, put, patch, ...
// GET /
//路由中間件
// (38:55) express 需要我們告訴它你有什麼網址需要處理的
app.get("/", (req, res, next) => {
  console.log("這裡是首頁");
  res.send("hello Express");
});

app.get("/test", (req, res, next) => {
  console.log("這裡是test");
  res.send("hello test");
});

let stockRouter = require("./routers/stocks");
app.use("/api/1.0/stocks", stockRouter);

app.use((req, res, next) => {
  console.log("這是middleware c");
  next();
  // next() 一定要寫，讓 express 知道要跳去下一個中間件
});

// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});
