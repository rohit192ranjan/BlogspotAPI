const User = require("./models/User.js");
let jwt = require('jsonwebtoken')

let authenticate = async(req, res, next) => {
    let {token} = req.cookies
    if(!token){
        return res.status(200).json({
            message: 'Please login or register first'
        })
    }
    let {id} = await jwt.verify(token, process.env.JWT_SECRET)
    let user = await User.findById(id)
    if(!user){
        return res.status(200).json({
            message: 'Please login or register first'
        })
    }
    req.user = user
    next()
}

module.exports = authenticate