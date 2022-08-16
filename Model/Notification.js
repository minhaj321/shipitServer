const mongoose = require('mongoose');

const Notification = new mongoose.Schema({

    accountId: {
        type: String,
        required: true
    },
    notificationHeader: {
        type: String,
        required: true
    },
    notificationMessage: {
        type: String,
        required: true
    },
    timeAndDate: {
        type: String,
        required: true
    },
    actionPath:{
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Notification", Notification);