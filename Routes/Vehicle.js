const express = require ('express');

const router = express.Router();

const {addVehicle,deleteVehicle, getAllVehicles,getVehicleById, getVehicleByUser} =require('../Controllers/Vehicle');


router.post('/addVehicle',addVehicle);

router.post('/deleteVehicle',deleteVehicle);

router.get('/getAllVehicle',getAllVehicles);

router.post('/getVehicleById',getVehicleById);

router.post('/getVehicleByUser' , getVehicleByUser)

module.exports = router;