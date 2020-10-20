var fs = require("fs");
var readData = "데이터 입력 전입니다.";

fs.readFile("./example/test.txt", "utf8", function (err, result) {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.error("second func");
    readData = result;
    console.log(result);
  }
});

console.log("first func");
console.log(readData);
console.log("third func");
