const { User } = require("../models/User");

let auth = (req, res, next) => {

    //인증처리 하는 곳
    //1. 클라이언트에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //2. 토큰을 복호화 한 후 User을 가져옴
    User.findByToken(token, (err,user) => {
        if(err) throw err
        if(!user) return res.json({isAuth : false, error : true})

        req.token = token
        req.user = user
        next()

    })

    //3. 있으면 인증 OK! 없으면 Reject !
}

module.exports = {auth};