const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

const User = mongoose.model('User',userSchema)

//User모델을 모듈 밖에서도 사용할 수 있게 하는 코드
module.exports= {User}