const mongoose = require('mongoose');

const Trip = mongoose.Schema({
    accountId:{
        type:String,
        required:true
    },
    vehicleId:{
        type:String,
        required:true
    },
    departureDate:{
        type:String,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },
    departureAddress:{
        type:String,
        required:true
    },
    departureCity:{
        type:String,
        required:true
    },
    departureLongitude:{
        type:String,
        required:true
    },
    departureLattitude:{
        type:String,
        required:true
    },
    destinationLongitude:{
        type:String,
        required:true
    },
    destinationLattitude:{
        type:String,
        required:true
    },
    destinationAddress:{
        type:String,
        required:true
    },
    destinationCity:{
        type:String,
        required:true
    },
    pricePerShipmentOrder:{
        type: String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    shipmentOffers:[]
},{timestamps:true});
module.exports = new mongoose.model("Trip",Trip );