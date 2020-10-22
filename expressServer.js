const express = require('express')
const request = require("request");
const app = express()

//database 연결 설정 ------------
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1q2w3e4r",
  database: "fintech1019",
});
connection.connect();
//database 연결 설정 ------------
//connection pooling 기법 검색

app.set('views', __dirname + '/views');
//뷰 파일이 있는 디렉토리를 지정합니다.
app.set('view engine', 'ejs');
//여러가지 뷰 엔진중에서 ejs 를 사용하겠다 

app.use(express.json());
//JSON 형태의 데이터 전송을 허용하겠다
app.use(express.urlencoded({ extended: false }));
//urlencoded 형식의 데이터 전송을 허용하겠다

app.use(express.static(__dirname + '/public'));
//정적 파일(디자인 플러그인 등)을 사용하기 위한 폴더 설정

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/signup', function(req, res){
  res.render('signup');
})

app.get('/authResult', function(req, res){
  var authCode = req.query.code;
  console.log(authCode);
  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: {
      "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
    },
    //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
    form: {
      code : authCode,
      client_id : "q7kH44ThJwjpvNRg0BbJvE1yxvx5X53DKz1rNgPF",
      client_secret : "yVT6irMr2h4ZTHzZY7sDpbvhm1nlOzr4nP7DYRVy",
      redirect_uri : "http://localhost:3000/authResult",
      grant_type : "authorization_code"
      //#자기 키로 시크릿 변경
    },
  };
  request(option, function(err, response, body){
    var accessRequestResult = JSON.parse(body); //JSON 오브젝트를 JS 오브젝트로 변경
    console.log(accessRequestResult);
    res.render("resultChild", { data: accessRequestResult }); //data 이름으로 resultChild 에 데이터 전달
  })
})

app.post('/signup', function(req, res){
  var userName = req.body.userName;
  var userEmail = req.body.userEmail;
  var userPassword =req.body.userPassword;
  var userAccessToken = req.body.userAccessToken;
  var userRefreshToken = req.body.userRefreshToken;
  var userSeqNo = req.body.userSeqNo;
  connection.query("", function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
  
  console.log(req.body);
})

// app.post('/getData',function(req, res){
//   console.log(req.body);
//   var getUserId = req.body.sendUserId;
//   var getUserPassword = req.body.sendUserPassword;
//   console.log(getUserId, getUserPassword);
//   res.json(1);
// })

app.listen(3000);
