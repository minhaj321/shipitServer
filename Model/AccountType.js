const mongoose = require('mongoose');

const AccountType = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    accountType:{
        type: String,
        required:true
    }
})


module.exports = mongoose.model("AccountType", AccountType);