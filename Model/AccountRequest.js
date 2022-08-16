const mongoose = require('mongoose');

const AccountRequest = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    status:{
        type: String,
       default:'Pending'
    }
})


module.exports = mongoose.model("AccountRequest", AccountRequest);