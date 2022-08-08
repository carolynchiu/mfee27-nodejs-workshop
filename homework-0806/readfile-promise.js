const fs = require("fs");

// 記得要放編碼 utf8
// callback
// readFile 去硬碟讀檔案，這是很慢的事，他是非同步

function readFile(path, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

readFile("test.txt", "utf8")
  .then((data) => {
    // 接住resolve
    console.log(data);
  })
  .catch((err) => {
    // 用來接住 reject
    console.error("在 promise 發生錯誤:", err);
  });

//故意犯錯 test.txt 寫成 test1.txt
readFile("test1.txt", "utf8")
  .then((data) => {
    // 接住resolve
    console.log(data);
  })
  .catch((err) => {
    // 用來接住 reject
    console.error("在 promise 發生錯誤:", err);
  });
