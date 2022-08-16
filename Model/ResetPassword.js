const mongoose = require ('mongoose');

const ResetPassword = new mongoose.Schema({
    email:{
        type: String,
        required: true
    }

},{timestamps:true});


module.exports = mongoose.model('ResetPassword',ResetPassword);