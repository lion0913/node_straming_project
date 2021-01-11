// expression 모듈을 가져오고 이 function을 이용해 새로운 express 앱을 만듧(1~2 line)
const express = require('express')
const app = express()
const port = 5000 //포트 번호
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

const config = require('./config/key')

// client에서 주는 정보를 서버가 이해할 수 있는 방식으로 변환하는 과정 
// application/x-www-form-unlencoded (ex) say=Hi&to=Mom)
app.use(bodyParser.urlencoded({extended : true}));
// application/json type으로 된 것을 분석해서 가져올 수 있게
app.use(bodyParser.json());
app.use(cookieParser());

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


app.post('/api/users/register',(req,res) => {

  //회원가입시 필요한 정보들을 클라이언트에서 가져오면 database에 넣어주는 작업

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({success : false, err})
    return res.status(200).json({
      success : true
    })
  }) //user모델에 저장됨.

})

app.post('/api/users/login', (req,res) => {
  // 요청된 이메일이 데이터 베이스에 있는지 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess : false,
        message : "이메일에 해당하는 유저가 없습니다."
      })
    } 
    // 만약 있다면 비밀번호가 일치하는지 확인할 것
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다."})
      }
      //토큰 생성
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err)

        // 에러가 아니라면 토큰을 저장 (1. 쿠키 2. 로컬스토리지)
        //쿠키 Parser 설치
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess : true, userId : user._id})
      })

    })

  })  
})

app.post('/api/users/auth', auth, (req,res) => {
  // 여기까지 오면 인증이 성공했다는 뜻
  res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    image : req.user.image
  })

})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, 
    {token : ""},
    (err, user) => {
      if(err) return res.json({success : false, err})
      return res.status(200).send({
        success : true
      })
    })
})


//5000 포트에서 이 문장을 수행 -> console에 출력 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
