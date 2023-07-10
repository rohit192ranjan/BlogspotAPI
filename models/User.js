const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
    unique:true,},
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic:{
        public_id: {
            type: String,
            default: 'None'
        },
        url: {
            type: String,
            default: 'None'
        }
    }
},{timestamps:true});

UserSchema.methods.getToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '15d'})
}

module.exports = mongoose.model("User",UserSchema)
