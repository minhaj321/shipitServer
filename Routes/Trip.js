const express = require ('express');
const router = express.Router();

const {getTripByCarrier,getAllActiveTrips,cancelShipment,createTrip, getAllTrips, getTripById, createShipmentRequest , viewShipmentOfferDetails, acceptShipmentOffer, rejectShipmentOffer, startShipmentOffers, pickupPackage,  uploadShipmentVerificationImage, startSingleShipment, dropOff, confirmDropOff,giveRating, expireShipmentOffer, getShipmentOfferByUser, getShipmentOffersByCarrier, activeTrip, completeTrip, verifyShipment,skipShipment, getAllActiveShipmentsOfCarrier, closeTrip, cancelTrip, countCarrierActiveShipment, countCarrierShipperActiveShipment, countCarrierPendingShipment, countCarrierShipperPendingShipment, countCarrierCompleteShipment, countCarrierShipperCompleteShipment,countCarrierCancelledTrips,countShipperActiveShipment,countCarrierClosedTrips,countCarrierActiveTrips, getShipmentById} = require('../Controllers/Trip');

router.post('/createTrip',createTrip);

router.get('/getAllTrips', getAllTrips);

router.get('/getAllActiveTrips', getAllActiveTrips);

router.post('/getTripById' , getTripById);

router.post('/getTripByCarrier' , getTripByCarrier);

router.post('/activeTrip',activeTrip);

router.post('/completeTrip',completeTrip);

router.post('/closeTrip',closeTrip);

router.post('/cancelTrip',cancelTrip);

router.post('/createShipmentRequest' , createShipmentRequest)

router.post('/viewShipmentOfferDetails' , viewShipmentOfferDetails)

router.post('/expireShipmentOffer',expireShipmentOffer)

router.post('/getShipmentById',getShipmentById)

router.post('/acceptShipmentOffer' , acceptShipmentOffer)

router.post('/rejectShipmentOffer' , rejectShipmentOffer )

router.post('/getShipmentOfferByUser' , getShipmentOfferByUser)

router.post('/getShipmentOffersByCarrier' , getShipmentOffersByCarrier)

// router.post('/skipShipment' , skipShipment)

router.post('/cancelShipment' , cancelShipment)

// router.post('/startShipmentOffers',startShipmentOffers);

router.post('/getAllActiveShipmentsOfCarrier',getAllActiveShipmentsOfCarrier)

router.post('/pickupPackage', pickupPackage);

router.post('/uploadShipmentVerificationImage',uploadShipmentVerificationImage)

router.post('/verifyShipment',verifyShipment);

router.post('/startSingleShipment',startSingleShipment);

router.post('/dropOff',dropOff);

router.post('/confirmDropOff',confirmDropOff);

router.post('/giveRating',giveRating);

router.post('/countCarrierActiveShipment',countCarrierActiveShipment);

router.post('/countShipperActiveShipment',countShipperActiveShipment);

router.post('/countCarrierPendingShipment',countCarrierPendingShipment);

router.post('/countCarrierShipperPendingShipment',countCarrierShipperPendingShipment);

router.post('/countCarrierCompleteShipment',countCarrierCompleteShipment);

router.post('/countCarrierShipperCompleteShipment',countCarrierShipperCompleteShipment);

router.post('/countCarrierClosedTrips',countCarrierClosedTrips);

router.post('/countCarrierActiveTrips',countCarrierActiveTrips);

router.post('/countCarrierCancelledTrips',countCarrierCancelledTrips);








module.exports = router