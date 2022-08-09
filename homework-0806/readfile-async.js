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

async function readFileAsync() {
  try {
    let result = await readFile("test.txt", "utf8");
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

readFileAsync();
