const express = require('express')
const request = require("request");
const app = express()
var auth = require('./lib/auth');
var jwt = require('jsonwebtoken');
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

app.get('/login', function(req, res){
  res.render('login');
})

app.get('/authTest', auth ,function(req, res){
  console.log(req.decoded);
  //토큰에 있는 데이터 확인
  res.json("로그인 성공! / 컨텐츠를 볼 수 있습니다.")
})

app.get('/main', function(req, res){
  res.render('main');  
})

app.get('/balance', function(req, res){
  res.render('balance');  
})

app.get('/qrcode', function(req, res){
  res.render('qrcode');  
})

app.get('/qrreader', function(req, res){
  res.render('qrreader');
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
  var userInsertSql ="INSERT INTO user (`name`, `email`, `password`, `accesstoken`, `refreshtoken`, `userseqno`) VALUES (?, ?, ?, ?, ?, ?);"
  //데이터 베이스 서버에 전달할 SQL , 입력 변수는 ? <-- 표현으로... , ? <-- 안에 데이터는 connection.query function 에 2번째 [배열]
  connection.query(userInsertSql, [userName, userEmail, userPassword, userAccessToken, userRefreshToken, userSeqNo], function (error, results, fields) {
    if (error) throw error;
    else {
      res.json(1);
    }
  });
  console.log(req.body);
})

app.post('/login', function(req, res){
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  var userCheckSql = "SELECT * FROM user WHERE email = ?"
  connection.query(userCheckSql, [userEmail], function (error, results, fields) {
    if (error) throw error;
    else {
      if(results.length == 0){
        res.json(2);
      }
      else {
        var storedPassword = results[0].password;
        if(userPassword == storedPassword){
          var tokenKey = "fintech1234!" // 토큰키 추가
          jwt.sign(
            {
              userId: results[0].id,
              userEmail: results[0].email,
            },
            tokenKey,
            {
              expiresIn: "1d",
              issuer: "fintech.admin",
              subject: "user.login.info",
            },
            function (err, token) {
              console.log("로그인 성공", token);
              res.json(token);
            }
          );
        }
        else {
          //로그인 불가
          res.json(2);
        }
      }
    }
  });
})

app.post('/list', auth, function(req, res){
  var userId = req.decoded.userId;
  //{ 토큰에 담겨있는 사용자 정보
  // "userId": 6,
  // "userEmail": "test@test.com",
  // "iat": 1600921603,
  // "exp": 1601008003,
  //"iss": "fintech.admin",
  //"sub": "user.login.info"
  //}
  var userSearchSql = "SELECT * FROM user WHERE id = ?";
  connection.query(userSearchSql,[userId], function(err, results){
    if(err) throw err;
    else {
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers: {
          "Authorization" : "Bearer " + results[0].accesstoken
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          user_seq_no : results[0].userseqno
        },
      };
      request(option, function(err, response, body){
        var listDataResult = JSON.parse(body); //JSON 오브젝트를 JS 오브젝트로 변경
        console.log(listDataResult);
        res.json(listDataResult)
      })    
    }
  })
})

app.post('/balance', auth , function(req, res){
  var userId = req.decoded.userId;
  var finusenum = req.body.fin_use_num;
  console.log(finusenum);
  //데이터베이스에 사용자 Accesstoken , 조회 후
  //금융위 API 잔액 조회 요청 만들고 데이터 그대로 response 하기
  
  var userSearchSql = "SELECT * FROM user WHERE id = ?";
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991599190U" + countnum; //이용기관번호 본인것 입력
  connection.query(userSearchSql,[userId], function(err, results){
    if(err) throw err;
    else {
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers: {
          "Authorization" : "Bearer " + results[0].accesstoken
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          bank_tran_id : transId,
          fintech_use_num : finusenum,
          tran_dtime : "20201022144300"
        },
      };
      request(option, function(err, response, body){
        var balanceData = JSON.parse(body); //JSON 오브젝트를 JS 오브젝트로 변경
        console.log(balanceData);
        res.json(balanceData)
      })    
    }
  })
})

app.post('/transactionlist', auth, function(req, res){
  var userId = req.decoded.userId;
  var finusenum = req.body.fin_use_num; 
  var userSearchSql = "SELECT * FROM user WHERE id = ?";
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991599190U" + countnum; //이용기관번호 본인것 입력
  connection.query(userSearchSql,[userId], function(err, results){
    if(err) throw err;
    else {
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers: {
          "Authorization" : "Bearer " + results[0].accesstoken
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          bank_tran_id: transId,
          fintech_use_num:finusenum,
          inquiry_type:'A',
          inquiry_base:'D',
          from_date:'20200101',
          to_date:'20200101',
          sort_order:'D',
          tran_dtime:'20201022144300'
        },
      };
      request(option, function(err, response, body){
        var trasactionList = JSON.parse(body); //JSON 오브젝트를 JS 오브젝트로 변경
        console.log(trasactionList);
        res.json(trasactionList)
      })    
    }
  })
})

app.post('/withdraw', auth, function(req, res){
  var userId = req.decoded.userId;

  var finusenum = req.body.fin_use_num; 
  var to_fin_use_num = req.body.to_fin_use_num; 
  var amount = req.body.amount; 

  var userSearchSql = "SELECT * FROM user WHERE id = ?";
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991599190U" + countnum; //이용기관번호 본인것 입력
  connection.query(userSearchSql,[userId], function(err, results){
    if(err) throw err;
    else {
      var option = {
        method: "POST",
        url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
        headers: {
          "Authorization" : "Bearer " + results[0].accesstoken
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        json: {
          "bank_tran_id": transId, 
          "cntr_account_type": "N",
          "cntr_account_num": "7832932596", 
          "dps_print_content": "쇼핑몰환불", 
          "fintech_use_num": finusenum, 
          "wd_print_content": "오픈뱅킹출금",
          "tran_amt": amount,
          "tran_dtime": "20201023110700",
          "req_client_name": "홍길동",
          "req_client_num": "HONGGILDONG1234",
          "req_client_fintech_use_num" : finusenum,
          "transfer_purpose": "ST",
          "recv_client_name": "진상언",
          "recv_client_bank_code": "097",
          "recv_client_account_num": "7832932596"
        },
      };
      request(option, function(err, response, body){
        var withdrawResult = body; //JSON 오브젝트를 JS 오브젝트로 변경
        console.log(withdrawResult);
        if(withdrawResult.rsp_code == "A0000"){
          var countnum2 = Math.floor(Math.random() * 1000000000) + 1;
          var transId2 = "T991599190U" + countnum2; //이용기관번호 본인것 입력        
          var option = {
            method: "POST",
            url: "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
            headers: {
              "Authorization" : "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNTk5MTkwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjExMjA4NTE5LCJqdGkiOiJjZDViNzJkNi00ODE3LTRhNDgtYjAyMC04OWE2Y2Q3ZDEzYTIifQ.qvo_WHV3h-wF30X7zW39WcecW00-fmmTtyqVRGExP2U"
            },
            //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
            json: {
              "cntr_account_type": "N",
              "cntr_account_num": "4262679045",
              "wd_pass_phrase": "NONE",
              "wd_print_content": "환불금액",
              "name_check_option": "on",
              "tran_dtime": "20200925150000",
              "req_cnt": "1",
              "req_list": [
                {
                  "tran_no": "1",
                  "bank_tran_id": transId2,
                  "fintech_use_num": to_fin_use_num,
                  "print_content": "쇼핑몰환불",
                  "tran_amt": amount,
                  "req_client_name": "홍길동",
                  "req_client_fintech_use_num": to_fin_use_num,
                  "req_client_num": "110435475398",
                  "transfer_purpose": "ST"
                }
              ]            
            },
          };
          request(option, function(err, response, body){
            console.log("입금이체 : ", body.rsp_code);
            if(body.rsp_code == "A0000"){
              res.json(1)
            }
          })
        }
      })    
    }
  })
})


// app.post('/getData',function(req, res){
//   console.log(req.body);
//   var getUserId = req.body.sendUserId;
//   var getUserPassword = req.body.sendUserPassword;
//   console.log(getUserId, getUserPassword);
//   res.json(1);
// })

app.listen(3000);
