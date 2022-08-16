const mongoose = require('mongoose');

const User = new mongoose.Schema({
   
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        suspended:{
            type: Boolean,
            default: false
        },
        
    }
    },{timestamps:true});

module.exports = new mongoose.model('User' , User );