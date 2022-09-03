const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
// for hash password
const bcrypt = require("bcrypt");

// -> /api/1.0/auth/register
router.post("/api/1.0/auth/register", async (req, res, next) => {
  // TODO:確認資料有沒有收到: 使用 express.json 中間件
  console.log("register", req.body);
  // TODO:資料的驗證（後端不可以相信來自前端的資料）
  // TODO:檢查 email 有沒有重複 ->不能重複
  //      ->方法1: 交給 DB，把 email 欄位設定成 unique
  //      ->方法2: 自己檢查，去資料庫撈 email 有沒有存在
  let [member] = await pool.execute("SELECT * FROM members WHERE email = ?", [
    req.body.email,
  ]);
  console.log("member", member);
  if (member.length === 0) {
    // TODO:密碼要雜湊 hash
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    // TODO:資料存到資料庫
    let result = await pool.execute(
      "INSERT INTO members (email, password, name) VALUES (?, ?, ?)",
      [req.body.email, hashedPassword, req.body.name]
    );
    console.log("新增會員", result);
    // TODO:回覆前端
    res.json({ message: "註冊成功" });
  } else {
    //TODO:如果 member.length !== 0 (代表這個 email 已存在資料庫中)，回覆 400 跟錯誤訊息
    return res.status(400).json({ message: "此 email 已註冊" });
  }
});
module.exports = router;

// register {
//   email: 'carolyn55@gmail.com',
//   name: 'Carolyn Chiu',
//   password: 'testtest',
//   confirmPassword: 'testtest'
// }
