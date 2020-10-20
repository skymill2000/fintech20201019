const request = require("request");
request("https://www.naver.com", function (error, response, body) {
  console.log("body:", body); // Print the HTML for the Google homepage.
});
