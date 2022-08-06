function doWork(job, timer, cb) {
  // 為了模擬一個非同步工作
  setTimeout(() => {
    let dt = new Date();
    // callback 慣用設計：
    // 第一個參數: error
    // 第二個參數: 要回覆的資料
    cb(null, `完成工作 ${job} at ${dt.toISOString()}`);
  }, timer);
}
