const mongoose = require('mongoose');
const BussinessAccount = new mongoose.Schema({

    userId:
    {
        type: String,
        required: true
    },
    accountType :{
        type: String,
        required: true
    },
    businessName:
    {
        type: String,
        required: true
    },
    street:
    {
        type: String,
        required: true
    },
    town:
    {
        type: String,
        required: true
    },
    city:
    {
        type: String,
        required: true
    },
    province:
    {
        type: String,
        required: true

    },
    phoneNumber:
    {
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        required: true
    },
    verified:
    {
        type:Boolean,
        default:false
    }



}, { timestamps: true });
module.exports = mongoose.model("BusinessAccount", BussinessAccount);