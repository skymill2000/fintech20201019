const request = require("request");
request(
  "http://newsapi.org/v2/top-headlines?apiKey=78bc6ddd8cdb48ceac76f5f9b9dfc4c5&country=kr&category=business",
  function (error, response, body) {
    var parsedData = JSON.parse(body);
    //JSON String 으로 되어있는 데이터를 Js Object 변환
    //#work2 Title 목록만 조회하기 (for, object select)
    for (let index = 0; index < parsedData.articles.length; index++) {
      const element = parsedData.articles[index];
      console.log(index + 1, element.title);
    }
  }
);
request(
  "http://newsapi.org/v2/top-headlines?apiKey=78bc6ddd8cdb48ceac76f5f9b9dfc4c5&country=kr&category=business",
  function (error, response, body) {}
);
