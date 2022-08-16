const mongoose = require('mongoose');

const Auction = new mongoose.Schema({
   accountId:{
       type:String,
       required:true
   },
    packageId:{
        type: String,
        required: true
    },
    auctionDuration: {
        type: Number,
        required: true
    },
    shipmentOfferId:{
        type:String
    },
    choosenCarrierId:{
        type:String
    },
    startingBid: {
        type: Number,
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
    dropOffDate:{
        type:String,
        required:true
    },
    dropOffTime:{
        type:String,
        required:true
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
    pickupTime:{
        type:String,
        required:true
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
    status:{
        type:String,
        required:true
    },
    bids:[]
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Auction", Auction);