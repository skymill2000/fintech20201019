var http = require("http");

http
  .createServer(function (req, res) {
    var body = "hello Server";
    console.log("요청 발생");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("<html><h1>test</h1><input type='text'/></html>");
  })
  .listen(3000);
