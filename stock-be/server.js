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

//使用資料庫
const mysql = require("mysql2");
let pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //限制 pool 連線數的上限
    connectionLimit: 10,
    dateStrings: true,
  })
  .promise();

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

// API
// 列出所有股票代碼
// GET /stocks
app.get("/api/1.0/stocks", async (req, res, next) => {
  console.log("/api/1.0/stocks"); //有印表示有進來這個中間件
  // 寫法1:
  // let result = await pool.execute("SELECT * FROM stocks");
  // let data = result[0];
  // 寫法2:
  let [data] = await pool.execute("SELECT * FROM stocks");
  console.log(data);
  res.json(data);
});

////// 列出某個股票代碼的所有報價資料
// GET /stocks/2330
app.get("/api/1.0/stocks/:stockId", async (req, res, next) => {
  const stockId = req.params.stockId;

  // TODO: 去資料庫撈資料
  // FIXME: 這種寫法會造成 sql injection
  // let [data] = await pool.execute(
  //   `SELECT * FROM stock_prices WHERE stock_id =${stockId}`
  // );
  // let [data] = await pool.execute(
  //   "SELECT * FROM stock_prices WHERE stock_id =?",
  //   [stockId]
  // );
  // console.log(data);

  ////// 分頁
  //從 query string 取得目前在第幾頁，要有預設值，沒有設定就是要第一頁的資料 page
  let page = req.query.page || 1;
  //決定一頁要有幾筆 perPage
  const perPage = 5;

  //TODO:取得總筆數
  let [total] = await pool.execute(
    "SELECT COUNT(*) AS total FROM stock_prices WHERE stock_id=?",
    [stockId]
  );
  total = total[0].total;
  console.log("total", total);

  //TODO:從 total 與 perPage 算出總頁數 lastPage (hint: Math.ceil)
  const lastPage = Math.ceil(total / perPage);
  console.log("lastPage", lastPage);

  //TODO:計算 offset
  const offset = perPage * (page - 1);
  console.log("offset", offset);

  //TODO:根據 perPage 及 offset 從資料庫取得該頁資料
  let [data] = await pool.execute(
    "SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?",
    [stockId, perPage, offset]
  );
  console.log(data);
  //  把取得的資料回覆給前端
  // res.json({ stockId });
  // res.json(data);
  // TODO:回傳資料: pagination (前端可能需要的頁碼資料)與 data
  res.json({
    pagination: {
      total, // 總共有幾筆
      perPage, // 一頁有幾筆
      page, // 目前在第幾頁
      lastPage, // 總頁數
    },
    data,
  });
});

app.use((req, res, next) => {
  console.log("這是middleware c");
  next();
  // next() 一定要寫，讓 express 知道要跳去下一個中間件
});

// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});
