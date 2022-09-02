// stock-be > routers > stocks.js
const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
// 注意路徑

// API
// 列出所有股票代碼
// GET /stocks
router.get("/", async (req, res, next) => {
  // console.log("/api/1.0/stocks"); //有印表示有進來這個中間件
  // 寫法1:
  // let result = await pool.execute("SELECT * FROM stocks");
  // let data = result[0];
  // 寫法2:
  let [data] = await pool.execute("SELECT * FROM stocks");
  // console.log(data);
  res.json(data);
  //[ { id: '2330', name: '台積電' }, { id: '2603', name: '長榮' } ]
});

////// 列出某個股票代碼的所有報價資料
// GET /stocks/2330
router.get("/:stockId", async (req, res, next) => {
  const stockId = req.params.stockId;
  console.log("stockId", stockId);
  // (1) API TODO: 去資料庫撈資料
  // FIXME: 這種寫法(我的寫法)會造成 sql injection
  // let [data] = await pool.execute(`SELECT * FROM stock_prices WHERE stock_id =${stockId}`);

  // 比較好的寫法，不會造成 sql injection
  // let [data] = await pool.execute("SELECT * FROM stock_prices WHERE stock_id =?", [stockId]);
  // console.log(data);

  ////// ------ 分頁 ------
  // 分頁 -> GET /stocks/2330?page=1
  //從 query string 取得目前在第幾頁，要有預設值(使用||)，沒有設定就是要第一頁的資料 page
  let page = req.query.page || 1;
  //決定一頁要有幾筆 perPage
  const perPage = 5;

  // --- 1. 分頁 TODO: 取得總筆數
  let [total] = await pool.execute(
    "SELECT COUNT(*) AS total FROM stock_prices WHERE stock_id=?",
    [stockId]
  );
  // console.log(total);
  // 印出來長這樣 [ { total: 10 } ] -> 因為 mysql2 把所有撈出來的資料都放在陣列
  total = total[0].total;
  console.log("total", total);

  // --- 2. 分頁 TODO: 計算總頁數 -> 從 total 與 perPage 算出總頁數 lastPage
  // (hint: Math.ceil 無條件進位) <---> Math.floor 無條件捨去
  const lastPage = Math.ceil(total / perPage);
  console.log("lastPage", lastPage);

  // --- 3. 分頁 TODO: 計算 offset (要跳過幾筆)
  const offset = perPage * (page - 1);
  console.log("offset", offset);

  // --- 4. 分頁 TODO: 根據 perPage 及 offset 從資料庫取得該頁資料
  let [data] = await pool.execute(
    "SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?",
    [stockId, perPage, offset]
  );
  // console.log(data);

  // (2) API TODO: 把取得的資料回覆給前端
  // res.json({ stockId });
  // res.json(data);

  // --- 5. 分頁 TODO: 回傳資料: pagination物件(前端可能需要的頁碼資料)與 data
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

module.exports = router;
