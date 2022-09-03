const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
// for hash password
// 終端機輸入指令 npm i bcrypt，接下來引用他
const bcrypt = require("bcrypt");
// 終端機輸入指令 npm i express-validator，接下來引用他
const { body, validationResult } = require("express-validator");

const registerRules = [
  // 中間件: 檢查 email 是否合法
  body("email").isEmail().withMessage("Email 欄位請填寫正確格式"),
  // 中間件: 檢查密碼長度
  body("password").isLength({ min: 8 }).withMessage("密碼長度至少為 8"),
  // 中間件: 檢查 password & confirmPassword 是否一致
  // 客製自己想要的條件
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
      // value 就是 confirmPassword
    })
    .withMessage("密碼驗證不一致"),
];

////// -> /api/1.0/auth/register
router.post("/api/1.0/auth/register", registerRules, async (req, res, next) => {
  // --- (1) 確認資料有沒有收到: 使用 express.json 中間件 (在 server.js)
  console.log("register", req.body);
  // register {
  //   email: 'carolyn55@gmail.com',
  //   name: 'Carolyn Chiu',
  //   password: 'testtest',
  //   confirmPassword: 'testtest'
  // }

  // --- (2) 資料的驗證（後端不可以相信來自前端的資料）
  const validateResult = validationResult(req);
  console.log("validateResult", validateResult);
  if (!validateResult.isEmpty()) {
    // validateResult 不是空 -> 有錯誤 -> 回覆給前端
    return res.status(400).json({ errors: validateResult.array() });
  }

  // --- (3) 檢查 email 有沒有重複 ->不能重複
  //          -> 方法 1: 交給 DB，把 email 欄位設定成 unique
  //          -> 方法 2: 自己檢查，去資料庫撈 email 有沒有存在
  let [member] = await pool.execute("SELECT * FROM members WHERE email = ?", [
    req.body.email,
  ]);
  console.log("member", member);

  // --- (4) 如果 member.length > 0 (代表這個 email 已存在資料庫中)，回覆 400 跟錯誤訊息
  if (member.length > 0) {
    return res.status(400).json({ message: "此 email 已註冊" });
  }

  // --- (5) 密碼要雜湊 hash
  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  // --- (6) 把資料存到資料庫 (複習 SQL 語法)
  let result = await pool.execute(
    "INSERT INTO members (email, password, name) VALUES (?, ?, ?)",
    [req.body.email, hashedPassword, req.body.name]
  );
  console.log("新增會員", result);

  // --- (7) 回覆前端
  res.json({ message: "註冊成功" });
});

////// -> /api/1.0/auth/login
router.post("/api/1.0/auth/login", async (req, res, next) => {
  console.log("login", req.body);
  // TODO: 資料驗證
  // 確認這個 email 有沒有註冊過
  let [members] = await pool.execute("SELECT * FROM members WHERE email = ?", [
    req.body.email,
  ]);
  if (members.length == 0) {
    // 這個 email 沒有註冊過，就回覆 400
    // 如果有，回覆 400 跟錯誤訊息
    // members 的長度 == 0 -> 沒有資料 -> 這個 email 沒有註冊過
    return res.status(400).json({ message: "帳號或密碼錯誤" });
  }
  let member = members[0];
  // 有註冊過，就去比密碼
  // (X) bcrypt.hash(req.body.password) === member.password
  let compareResult = await bcrypt.compare(req.body.password, member.password);
  if (!compareResult) {
    // 如果密碼不對，就回覆 401
    return res.status(401).json({ message: "帳號或密碼錯誤" });
  }

  // TODO: 密碼比對成功 -> (1) jwt token (2) session/cookie
  // TODO: 回覆前端登入成功
  res.json({ message: "登入成功" });
});
module.exports = router;
