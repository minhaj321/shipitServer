const express = require('express');

const router = express.Router();

const {approveVehicleRequest,declineVehicleRequest,adminLogin, createAdmin, adminFogetPassword, adminResetPassword, getAllUsers, getAllCarriers, getAllShippers, getAllActiveAuction, getAllActiveTrip,getAllShipment,getAllActiveShipment, cancelShipment, countGetAllVehicle, countGetAllComplaint, countAccountRequest} = require('../Controllers/Admin');


router.post('/adminLogin',adminLogin);

router.post('/createAdmin',createAdmin);

router.post('/adminForgetPassword',adminFogetPassword);

router.post('/adminResetPassword',adminResetPassword);

router.get('/getAllUsers',getAllUsers);

router.get('/getAllCarriers',getAllCarriers);

router.post('/declineVehicleRequest',declineVehicleRequest);

router.post('/approveVehicleRequest',approveVehicleRequest);

router.get('/getAllShippers',getAllShippers);

router.get('/getAllActiveAuction',getAllActiveAuction);

router.get('/getAllActiveTrip',getAllActiveTrip);

router.get('/getAllShipment',getAllShipment);

router.get('/getAllActiveShipment',getAllActiveShipment);

router.get('/cancelShipment',cancelShipment);

router.get('/countGetAllVehicle',countGetAllVehicle);

router.get('/countGetAllComplaint',countGetAllComplaint);

router.get('/countAccountRequest',countAccountRequest);




module.exports = router