var http = require("http");

http
  .createServer(function (req, res) {
    var body = "hello Server";
    console.log("요청 발생");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("안녕하세요");
  })
  .listen(3001);
