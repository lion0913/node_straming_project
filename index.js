// expression 모듈을 가져오고 이 function을 이용해 새로운 express 앱을 만듧(1~2 line)
const express = require('express')
const app = express()
const port = 5000 //포트 번호
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key')

// client에서 주는 정보를 서버가 이해할 수 있는 방식으로 변환하는 과정 
// application/x-www-form-unlencoded (ex) say=Hi&to=Mom)
app.use(bodyParser.urlencoded({extended : true}));
// application/json type으로 된 것을 분석해서 가져올 수 있게
app.use(bodyParser.json());

const mongoose = require('mongoose')

//mongoDB connect 하는 부분 
mongoose.connect(config.mongoURI, {
  useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err))



//app(express)루트 디렉토리에 오면 'Hello world'호출함
app.get('/', (req, res) => {
  res.send('Hello World!안녕하세여~ 새해 복 많이 받으세요')
})
app.post('/register',(req,res) => {

  //회원가입시 필요한 정보들을 클라이언트에서 가져오면 database에 넣어주는 작업

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({success : false, err})
    return res.status(200).json({
      success : true
    })
  }) //user모델에 저장됨.

})

//5000 포트에서 이 문장을 수행 -> console에 출력 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

