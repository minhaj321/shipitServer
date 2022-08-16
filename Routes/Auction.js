const express = require ('express');

const {getAllOpenAuctions,createAuction,createBid,getAuctionByUser, terminateAuction,  getAllAuctions,getAuctionById, chooseBid, acceptShipmentOffer, rejectShipmentOffer} = require('../Controllers/Auction');
 
const router = express.Router();

router.post('/createAuction',createAuction);

router.post('/createBid',createBid);

router.post('/terminateAuction',terminateAuction)

router.get('/getAllAuctions',getAllAuctions);

router.get('/getAllOpenAuctions',getAllOpenAuctions);

router.post('/getAuctionById',getAuctionById)

router.post('/getAuctionByUser',getAuctionByUser)

router.post('/chooseBid',chooseBid);

router.post('/acceptShipmentOffer',acceptShipmentOffer);

router.post('/rejectShipmentOffer',rejectShipmentOffer);



module.exports = router;

