var fs = require("fs");
var readData = "데이터 입력 전입니다.";

function callbackFunc(callback) {
  //cb
  fs.readFile("./example/test.txt", "utf8", function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log("first");
      callback(result);
    }
  });
}

callbackFunc(function (dataResult) {
  console.log(dataResult);
  console.log("end");
});
