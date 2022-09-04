const express = require("express");
////// 初始化 dotenv
require("dotenv").config();
////// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();
const path = require("path");

// 在程式碼中，不要讓某些常數散亂在專案的各處
// 至少在同一個檔案中，可以放到最上方統一管理
// 目標是: 只需要改一個地方，全部的地方就生效
// 降低漏改到的風險 -> 降低程式出錯的風險
// 用 || 建立預設值
const port = process.env.SERVER_PORT || 3002;

// 啟用 session
const expressSession = require("express-session");
// 把 session 存在硬碟中
var FileStore = require("session-file-store")(expressSession);
app.use(
  expressSession({
    store: new FileStore({
      // session 儲存的路徑
      path: path.join(__dirname, "..", "sessions"),
    }),
    secret: process.env.SESSION_SECRET,
    // 如果 session 沒有改變的話，要不要重新儲存一次？
    resave: false,
    // 還沒初始化的，要不要存
    saveUninitialized: false,
  })
);

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

// 設置靜態檔案
// express.static => 讓靜態檔案可以有網址
// http://localhost:3002/uploads/檔案名稱
app.use(express.static(path.join(__dirname, "public")));
// 或是給 prefix
// http://localhost:3002/public/uploads/檔案名稱
// app.use('/public', express.static(path.join(__dirname, 'public')));

////// ========================== //////
////// --- middleware (中間件) --- //////
////// ========================== //////
// 如果要讓 express 認得 json，要使用這個中間件(幫你解析 payload 是不是 json)
app.use(express.json());

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

/////// 看 router > stock.js
let stockRouter = require("./routers/stocks");
app.use("/api/1.0/stocks", stockRouter);
// /api/1.0/stocks
// /api/1.0/stocks/:stockId

/////// 看 router > auth.js
let authRouter = require("./routers/auth");
app.use(authRouter);

app.use((req, res, next) => {
  console.log("這是middleware c");
  next();
  // next() 一定要寫，讓 express 知道要跳去下一個中間件
});

// 在所有的路由中間件的下面
// 既然前面所有的「網址」都比不到，表示前面沒有任何符合的網址 (旅程一直沒有被結束)
// --> 404
// 利用這個特殊的順序，把這裡當成 404
app.use((req, res, next) => {
  console.log("在所有路由中間件的下面 -> 404 了！");
  res.status(404).send("Not Found!!");
});

////// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});
