const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    unique:true,},
    desc:{
        type: String,
        required: true,
    },
    photo: {
        public_id: {
            type: String,
            default: 'None'
        },
        url: {
            type: String,
            default: 'None'
        }
    },
    username:{
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: false,
    }
},{timestamps:true});

module.exports = mongoose.model("Post",PostSchema)
