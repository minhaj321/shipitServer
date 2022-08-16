const mongoose = require('mongoose');
//const schema = mongoose.Schema;

const IndividualAccount = new mongoose.Schema({

userId:{
    type:String,
    required:true
},
firstName:{
    type:String,
    required:true
},
lastName:
{
    type:String,
    required:true
},
dateOfBirth:
{
    type:String,
    required:true
},
gender:
{
    type:String,
    required:true
},
cnic:
{
    type:String,
    required:true
},
street:
{
    type:String,
    required:true
},
town:
{
    type:String,
    required:true
},
city:
{
    type:String,
    required:true
},
province:
{
    type:String,
    required:true
},
phoneNumber:
{
    type:String,
    required:true
},
shipperRole:{
    type: Boolean,
    default: false
},
carrierRole:{
    type: Boolean,
    default: false
},
profilePic:
{
    type:String,
    required:true
},
rating:
{
    type:String,
    required: true
},
verified:
{
    type:Boolean,
    default:false
}


},{timestamps:true});
module.exports = mongoose.model("IndividualAccount",IndividualAccount);
