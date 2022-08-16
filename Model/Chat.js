const mongoose = require('mongoose');

const Chat = new mongoose.Schema({

    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    chats: [
        {
            senderId: {
                type: String
            },
            message: {
                type: String
            },
            dateAndTime: {
                type: String
            }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Chat", Chat);