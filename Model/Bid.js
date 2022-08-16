const mongoose = require('mongoose');

const Bid = new mongoose.Schema({
  auctionId:
  {
    type: String,
    required: true
  },
  carrierId:
  {
    type: String,
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  vehicleId:{
    type: String,
    required: true
  }

}, { timestamps: true });
module.exports = mongoose.model("Bid", Bid);