//stock-be > utils > db.js
//把資料庫連線相關的設定從 server.js 中抽取出來，易於管理，也便於共用
require("dotenv").config();
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

module.exports = pool;
