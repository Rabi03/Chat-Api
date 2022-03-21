const jwt=require('jsonwebtoken')
const User = require('../models/UserModel')

exports.isUserAuthenticated = async(req,res,next)=> {
    const {token} = req.cookies

    if(!token){
        return res.status(400).send({
            success:false,
            error:{
                message: 'Login first to access this resource'
            }
        })
    }

    const decode=jwt.verify(token,process.env.JWT_SECRECT)

    req.user=await User.findById(decode.id)
    next()
}