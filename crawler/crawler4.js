// 用 axios 去目標 API 抓資料
// await 版本
// 更好的參數設定
// 1. 自動取得今日日期 （可能利用 cron 排程工具 系統每日自動執行）
// 2. 從檔案中讀取股票代碼
// 查到股票代碼的中文名稱
const fsPromise = require("fs").promises;
const axios = require("axios");
const { copyFileSync } = require("fs");
const moment = require("moment");

// 開始抓資料
// 2330 台積電
// 2603 長榮

// axios.get(url, 設定)
(async () => {
  try {
    // TODO: 需要從 stock.txt 的檔案裡讀取股票代碼
    let stockNo = await fsPromise.readFile("stock.txt", "utf8");

    // TODO: 去查詢股票代碼的中文名稱
    // https://www.twse.com.tw/zh/api/codeQuery?query=2330
    let queryNameResponse = await axios.get(
      "https://www.twse.com.tw/zh/api/codeQuery",
      {
        params: {
          query: stockNo,
        },
      }
    );
    console.log(queryNameResponse.data);
    let { suggestions } = queryNameResponse.data;
    // console.log(suggestions); //[ '0050\t元大台灣50' ]
    let suggestion = suggestions[0];
    if (suggestion === "(無符合之代碼或名稱)") {
      console.error(suggestion);
      throw new Error(suggestion);
    }
    let stockName = suggestion.split("\t").pop();
    console.log("stockName", stockName);

    let queryDate = moment().format("YYYYMMDD"); //'20220814';
    let response = await axios.get(
      `https://www.twse.com.tw/exchangeReport/STOCK_DAY`,
      {
        params: {
          response: "json",
          date: queryDate,
          stockNo: stockNo,
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
})();
