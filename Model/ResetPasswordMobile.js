const mongoose = require ('mongoose');

const ResetPasswordMobile = new mongoose.Schema({
    code:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    }

},{timestamps:true});


module.exports = mongoose.model('ResetPasswordMobile',ResetPasswordMobile);