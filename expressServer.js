const express = require('express')
const app = express()

app.set('views', __dirname + '/views');
//뷰 파일이 있는 디렉토리를 지정합니다.
app.set('view engine', 'ejs');
//여러가지 뷰 엔진중에서 ejs 를 사용하겠다 


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/hello', function (req, res) {
  res.render('test');
})



app.listen(3000)
