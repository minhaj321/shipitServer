const mongoose = require('mongoose');

const Complaint = new mongoose.Schema({
   shipperId:{
       type:String,
       required:true
   } ,
   carrierId:{
       type:String,
       required:true
   },
   shipmentId:
   {
       type:String,
       required:true
   },
   packageId:{
       type:String,
       required:true
   },
   chatroomId:{
       type:String,
       required:true
   },
   complaintTitle:{
       type:String,
       required:true
   },
   complaintDescription:{
       type:String,
       required:true
   },
   status:{
       type:String,
       required:true
   }
});
module.exports=mongoose.model("Complaint",Complaint);