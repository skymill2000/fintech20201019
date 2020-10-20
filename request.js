const request = require("request");
request(
  "http://newsapi.org/v2/top-headlines?apiKey=78bc6ddd8cdb48ceac76f5f9b9dfc4c5&country=kr&category=business",
  function (error, response, body) {
    var parsedData = JSON.parse(body);
    //JSON String 으로 되어있는 데이터를 Js Object 변환
    console.log(parsedData.totalResults);
    //#work2 Title 목록만 조회하기 (for, object select)
  }
);
