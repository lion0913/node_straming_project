const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10

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

userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){
        // 비밀번호를 암호화(bcrypt)
        // pre : user를 호출하고 db에 저장되기 전 행하는 function을 뜻함
        bcrypt.genSalt(saltRounds, function(err,salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
    
}) 


userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword : 1234567      디비에는 암호화된 비밀번호가 들어가있음
    bcrypt.compare(plainPassword, this.password, function(err,isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}


userSchema.methods.generateToken = function(cb) {
    //jsonwebtoken을 이용해 토큰 생성하기
    var user = this;
    //sign 함수를 이용해 아이디 + datube 라는 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'datube')

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}



userSchema.statics.findByToken = function(token, cb){
    var user = this;
    
    jwt.verify(token, 'datube', function(err, decoded) {
        // 유저 아이디로 유저를 찾은 다음
        user.findOne({"_id": decoded, "token" : token}, function(err,user) {
            if(err) return cb(err)
            cb(null,user)
        })

    })

}


const User = mongoose.model('User',userSchema)

//User모델을 모듈 밖에서도 사용할 수 있게 하는 코드
module.exports= {User}