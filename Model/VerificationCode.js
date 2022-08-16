const mongoose = require ('mongoose');
const VerificationCode=new mongoose.Schema({
    emailCode:{
        type:Number,
        required: true
    },
    accountId:{
        type: String,
        required: true
    }
    },{timestamps:true});

module.exports = mongoose.model('VerificationCode',VerificationCode);