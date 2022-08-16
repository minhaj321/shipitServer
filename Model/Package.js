const mongoose = require('mongoose');

const Package = mongoose.Schema({
    packageHeight:{
        type:String,
        required:true
    },
    packageWidth:{
        type:String,
        required:true
    },
    packageWeight:{
        type:String,
        required:true
    },
    packageType:{
        type:String,
        required:true
    },
    packageWorth:{
        type:Number,
        required:true
    },
    fragile:{
        type:Boolean,
        required:true
    },
    packageImageUrl:{
        type: String
    },
    packageStatus:{
        type: String,
        required: true
    }
},{timestamps:true});

module.exports = mongoose.model('Package',Package);