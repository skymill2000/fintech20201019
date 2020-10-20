var fs = require("fs");
console.log("A");
var result = fs.readFileSync("./example/test.txt", "utf8");
//non-blocking blocking 방식 nodejs
console.log(result);
console.log("C");
