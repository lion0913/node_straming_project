// expression 모듈을 가져오고 이 function을 이용해 새로운 express 앱을 만듧(1~2 line)
const express = require('express')
const app = express()
const port = 5000 //포트 번호
 
const mongoose = require('mongoose')

//mongoDB connect 하는 부분 
mongoose.connect('mongodb+srv://gogo:anfmd2chlrdh+_+@cluster0.y6nky.mongodb.net/mr?retryWrites=true&w=majority', {
  useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err))

//app(express)루트 디렉토리에 오면 'Hello world'호출함
app.get('/', (req, res) => {
  res.send('Hello World!안녕하세여~')
})

//5000 포트에서 이 문장을 수행 -> console에 출력 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

