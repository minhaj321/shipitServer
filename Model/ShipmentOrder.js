const mongoose = require('mongoose');

const ShipmentOrder = mongoose.Schema({
    packageId: {
        type: String,
        required: true
    },
    accountId:{
        type:String,
        required:true
    },
    carrierId:{
        type: String,
        required: true
    },
    destinationAddress: {
        type: String,
        required: true
    },
    destinationCity: {
        type: String,
        required: true
    },
    dropOffContactNumber: {
        type: String,
        required: true
    },
    dropOffContactName: {
        type: String,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    pickupCity: {
        type: String,
        required: true
    },
    pickupDate: {
        type: String,
        required: true
    },
    pickupLongitude:{
        type:String,
        required:true
    },
   pickupLattitude:{
        type:String,
        required:true
    },
    dropOffLongitude:{
        type:String,
        required:true
    },
    dropOffLattitude:{
        type:String,
        required:true
    },
    shipmentCreationTime:{
        type: String,
        required: true
    },
    shipmentExpiryTime:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    createdFrom:{
        type: String,
        required: true
    },
    chatRoomId:{
        type: String
    },
     verified:{
         type: Boolean,
         default: false
     },
     verificationImage:{
         type: String
     }

}, { timestamps: true });
module.exports = new mongoose.model("ShipmentOrder",ShipmentOrder );