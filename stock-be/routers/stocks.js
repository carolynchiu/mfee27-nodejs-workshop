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
  console.log(data);
  res.json(data);
});

////// 列出某個股票代碼的所有報價資料
// GET /stocks/2330
router.get("/:stockId", async (req, res, next) => {
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

module.exports = router;
