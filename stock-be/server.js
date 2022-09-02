const express = require("express");
////// 初始化 dotenv
require("dotenv").config();
////// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();

// 在程式碼中，不要讓某些常數散亂在專案的各處
// 至少在同一個檔案中，可以放到最上方統一管理
// 目標是: 只需要改一個地方，全部的地方就生效
// 降低漏改到的風險 -> 降低程式出錯的風險
// 用 || 建立預設值
const port = process.env.SERVER_PORT || 3002;

////// npm i cors
// --- (1) ---
// 使用這個第三方提供的 cors 中間件
// 來允許跨源存取
// 預設都是全部開放
const cors = require("cors");
app.use(cors());
// --- (2) ---
// 下面為客製化設定
// 使用情境: 當前後端網址不同時，只想允許自己的前端來跨源存取
//          就可以利用 origin 這個設定來限制，不然預設是 '*' (全部)
// const corsOptions = {
//   origin: ['http://localhost:3000'],
// };
// app.use(cors(corsOptions));

////// 使用資料庫
// 查看 -> stock-be > utils > db.js
// 引用 server 需要的資料庫模組
const pool = require("./utils/db");

////// middleware (中間件)
// --- (1) 一般的 middleware
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

// app.[method] -> method: get, post, delete, put, patch, ...
// --- (2) 路由 middleware
// (38:55) express 需要我們告訴它你有什麼網址需要處理的
// GET
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

////// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});