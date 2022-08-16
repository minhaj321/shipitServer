const Package = require('../Model/Package');
const ShipmentOrder = require('../Model/ShipmentOrder');
const Trip = require('../Model/Trip');
const IndividualAccount = require('../Model/IndividualAccount');
const moment = require('moment');
const Chat = require('../Model/Chat');
const Notification = require('../Model/Notification');
const User = require('../Model/User');
const { sendMail } = require('../Utils/nodemailer');

exports.createTrip = async (req, res) => {
    try {

        const { accountId, vehicleId, departureDate, departureTime, departureAddress, departureCity, departureLongitude, departureLattitude, destinationLongitude, destinationLattitude, destinationAddress, destinationCity, pricePerShipmentOrder } = req.body;

        const newTrip = new Trip({ accountId, vehicleId, departureDate, departureTime, departureAddress, departureCity, departureLongitude, departureLattitude, destinationLongitude, destinationLattitude, destinationAddress, destinationCity, pricePerShipmentOrder, status: 'Open' });

        const response = await newTrip.save();

        res.json({
            status: 200,
            message: response
        })

    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.getAllTrips = async (req, res) => {
    try {
        const response = await Trip.find();

        if (response) {
            res.json({
                status: 200,
                message: response
            })
        } else {
            res.json({
                status: 404,
                message: "No Trips found"
            })
        }


    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}

exports.getTripById = async (req, res) => {

    const { tripId } = req.body;

    try {
        const trip = await Trip.findOne({ _id: tripId })

        if (trip) {
            res.json({
                status: 200,
                message: trip
            })
        } else {
            res.json({
                status: 404,
                message: "Trip not found. It might have been removed"
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}

exports.getTripByCarrier = async (req, res) => {

    const { carrierId } = req.body;

    try {
        const trip = await Trip.find({ accountId: carrierId })

        if (trip) {
            res.json({
                status: 200,
                message: trip
            })
        } else {
            res.json({
                status: 404,
                message: "You Don't have any trip"
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}

exports.activeTrip = async (req, res) => {
    const { tripId } = req.body;

    try {
        const response = await Trip.findByIdAndUpdate({ _id: tripId }, { $set: { status: 'Active' } }, { new: true });

        res.json({
            status: 200,
            message: response
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error
        })
    }
}

exports.completeTrip = async (req, res) => {
    const { tripId } = req.body;

    try {
        const response = await Trip.findByIdAndUpdate({ _id: tripId }, { $set: { status: 'Complete' } }, { new: true });

        res.json({
            status: 200,
            message: response
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error
        })
    }
}

exports.closeTrip = async (req,res) =>{
    try {
        const {tripId} = req.body;
        const response = await Trip.findByIdAndUpdate({_id:tripId},{$set:{status:'Close'}},{new:true});

        response.json({
            status:200,
            message:response
        })
    } catch (error) {
        res.json({
            status:403,
            message:error.message
        })
    }
}


exports.cancelTrip = async (req,res) =>{
    try {
        const {tripId} =req.body
        const response = await Trip.findByIdAndUpdate({_id:tripId},{$set:{status:'Cancel'}},{new:true});

        res.json({
            status:200,
            message:response
        })
    } catch (error) {
        res.json({
            status:403,
            message:error.message
        })
    }
}

exports.createShipmentRequest = async (req, res) => {

    const { tripId, accountId, carrierId, destinationAddress, destinationCity, dropOffContactNumber, dropOffContactName, pickupAddress, pickupCity, pickupDate, pickupLongitude, pickupLattitude, dropOffLongitude, dropOffLattitude, packageHeight, packageWidth, packageWeight, packageType, packageWorth, fragile } = req.body;

    try {
        const newPackage = await Package({ packageHeight, packageWidth, packageWeight, packageType, packageWorth, fragile, packageStatus: 'not_picked_up' })

        const packageResponse = await newPackage.save();

        try {

            let creationTime = moment().format('LT')

            let expiryTime = moment(creationTime, "hh:mm A").add(15, 'minutes').format('LT');

            const newShipmentOrder = await ShipmentOrder({ packageId: packageResponse._id, carrierId: carrierId, accountId, destinationAddress, destinationCity, dropOffContactNumber, dropOffContactName, pickupAddress, pickupCity, pickupDate, pickupLongitude, pickupLattitude, dropOffLongitude, dropOffLattitude, shipmentCreationTime: creationTime, shipmentExpiryTime: expiryTime, status: 'Pending', createdFrom: 'Trip' });

            const newshipmentResponse = await newShipmentOrder.save();

            try {
                const updatedTrip = await Trip.findByIdAndUpdate({ _id: tripId }, { $push: { shipmentOffers:newshipmentResponse._id } }, { new: true })

                try {
                    const trip = await Trip.findOne({ _id: tripId })

                    const newNotification = await Notification({ accountId: trip.accountId, notificationHeader: ` New Shipment Request on Trip ${trip._id} `, notificationMessage: `There is a new shipment request on Trip ${trip._id} from Shipper ${newshipmentResponse.accountId}`, timeAndDate: moment().format('LLL'), actionPath: `/shipmentOffer/${newshipmentResponse._id}` })

                    await newNotification.save();

                    try {
                        const accountResponse = await IndividualAccount.findOne({ _id: newNotification.accountId })

                        try {
                            const userResponse = await User.findOne({ _id: accountResponse.userId })


                            let mail = {
                                to: userResponse.email,
                                from: `${process.env.GMAIL_USER}`,
                                text: `There is new Shipment request on your trip `

                            }

                            let resMail = await sendMail(mail)

                            res.json({
                                status: 200,
                                message: updatedTrip
                            })
                        } catch (error) {
                            res.json({
                                status: 500,
                                message: error.message
                            })
                        }
                    } catch (error) {
                        res.json({
                            status: 500,
                            message: error.message
                        })
                    }

                } catch (error) {
                    res.json({
                        status: 500,
                        message: error.message
                    })
                }


            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }


        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }

}

exports.expireShipmentOffer = async (req, res) => {

    const { shipmentOfferId } = req.body;

    try {
        const updatedOffer = await ShipmentOrder.findOneAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Expired' } }, { new: true })

        const newNotification = await Notification({ accountId: updatedOffer.accountId, notificationHeader: ` Shipment Order Expired `, notificationMessage: `Your Shipment Request ${shipmentOfferId} has been expired due to no response from the carrier`, timeAndDate: moment().format('LLL'), actionPath: `/shipmentOffer/${updatedOffer._id}` })

        await newNotification.save();

        try {
            const accountResponse = await IndividualAccount.findOne({ _id: newNotification.accountId })

            try {
                const userResponse = await User.findOne({ _id: accountResponse.userId })


                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Delete vehicle request by Admin`

                }

                let resMail = await sendMail(mail)

                res.json({
                    status: 200,
                    message: resMail
                })
            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }

    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }

}

exports.cancelShipment = async (req, res) => {

    const { shipmentOfferId } = req.body;

    try {
        const updatedOffer = await ShipmentOrder.findOneAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Cancel' } }, { new: true })
        try {
            const accountResponse = await IndividualAccount.findOne({ _id: updatedOffer.accountId })

            try {
                const userResponse = await User.findOne({ _id: accountResponse.userId })


                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Delete vehicle request by Admin`

                }

                let resMail = await sendMail(mail)

                res.json({
                    status: 200,
                    message: resMail
                })
            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }

    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }

}



exports.viewShipmentOfferDetails = async (req, res) => {
    const { shipmentOfferId } = req.body;

    try {
        const shipmentOffer = await ShipmentOrder.findOne({ _id: shipmentOfferId })

        try {
            const package = await Package.findOne({ _id: shipmentOffer.packageId })

            res.json({
                status: 200,
                message: {
                    shipmentOffer: shipmentOffer,
                    package: package
                }
            })

        } catch (error) {
            res.json({
                status: 404,
                message: error.message
            })
        }

    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}

exports.getShipmentById = async (req,res)=>{
    const {shipmentOfferId} = req.body;
    try {
        const response = await ShipmentOrder.findOne({_id:shipmentOfferId});
        
        res.json({
            status:200,
            message:response
        })
    } catch (error) {
        res.json({
            status:409,
            message:error.message
        })
    }
}


exports.acceptShipmentOffer = async (req, res) => {
    const { shipmentOfferId, carrierId } = req.body;

    try {
        const shipmentOffer = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Waiting' } }, { new: true })


        try {
            const newChatRoom = await Chat({ user1: carrierId, user2: shipmentOffer.accountId })

            const response = await newChatRoom.save()


            const updatedShipmentOffer = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { chatRoomId: response._id } }, { new: true })

            const newNotification = await Notification({ accountId: shipmentOffer.accountId, notificationHeader: ` Shipment Order Accepted `, notificationMessage: `Your Shipment Request ${shipmentOfferId} has been accepted`, timeAndDate: moment().format('LLL'), actionPath: `/shipmentOffer/${updatedShipmentOffer._id}` })

            await newNotification.save();

            try {
                const accountResponse = await IndividualAccount.findOne({ _id: newNotification.accountId })

                try {
                    const userResponse = await User.findOne({ _id: accountResponse.userId })


                    let mail = {
                        to: userResponse.email,
                        from: `${process.env.GMAIL_USER}`,
                        text: `Your shipment offer has been accepted`

                    }

                    let resMail = await sendMail(mail)

                    res.json({
                        status: 200,
                        message: resMail
                    })
                } catch (error) {
                    res.json({
                        status: 500,
                        message: error.message
                    })
                }
            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }



        } catch (error) {
            res.json({
                status: 400,
                message: error.message
            })
        }


    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}



exports.skipShipment = async (req, res) => {
    const { shipmentOfferId } = req.body;
    try {
        const skipShipmentOffer = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Closed' } }, { new: true })

        const newNotification = await Notification({ accountId: skipShipmentOffer.accountId, notificationHeader: ` Shipment Order Rejected `, notificationMessage: `Your Shipment Request ${shipmentOfferId} has been Rejected`, timeAndDate: moment().format('LLL'), actionPath: `/shipmentOffer/${updatedShipmentOffer._id}` })

        await newNotification.save();
        
        res.json({
            status:200,
            message:newNotification
        })

       } catch (err) {
        res.json({
            status: 400,
            message: error.message
        })
    }
}



exports.rejectShipmentOffer = async (req, res) => {
    const { shipmentOfferId } = req.body;

    try {
        const updatedShipmentOffer = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Rejected' } }, { new: true })

        const newNotification = await Notification({ accountId: updatedShipmentOffer.accountId, notificationHeader: ` Shipment Order Rejected `, notificationMessage: `Your Shipment Request ${shipmentOfferId} has been Rejected`, timeAndDate: moment().format('LLL'), actionPath: `/shipmentOffer/${updatedShipmentOffer._id}` })

        await newNotification.save();

        try {
            const accountResponse = await IndividualAccount.findOne({ _id: newNotification.accountId })

            try {
                const userResponse = await User.findOne({ _id: accountResponse.userId })


                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your shipment offer has been rejected`

                }

                let resMail = await sendMail(mail)

                res.json({
                    status: 200,
                    message: resMail
                })
            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }

    } catch (error) {
        res.json({
            status: 200,
            message: error.message
        })
    }
}


exports.getShipmentOfferByUser = async (req, res) => {
    const { accountId } = req.body;

    try {
        const shipmentOrders = await ShipmentOrder.find({ accountId: accountId });

        res.json({
            status: 200,
            message: shipmentOrders
        })

    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}


exports.getShipmentOffersByCarrier = async (req, res) => {
    const { carrierId } = req.body;

    try {
        var shipmentOrders = await ShipmentOrder.find({ carrierId: carrierId});

        shipmentOrders = shipmentOrders.filter((v)=> v.status !== 'Pending')
 
        res.json({
            status: 200,
            message: shipmentOrders
        })

    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}

// exports.startShipmentOffers = async (req,res) =>{
//     const {shipmentOfferIds} = req.body;

//     try {



//        shipmentOfferIds.forEach( async shipmentOfferId => {

//             const updatedStartTrip = await ShipmentOrder.findByIdAndUpdate({_id:shipmentOfferId},{$set:{status:'Active'}},{new:true}) 

//         })


//          res.json({
//              status:200,
//             message: "Shipment offers have been activated"
//         })

//     } catch (error) {
//             res.json({
//             status:403,
//              message:error.message
//          })

//         console.log(error);
//     }
// }


exports.getAllActiveTrips = async (req, res) => {
    try {
        const response = await Trip.find({status :'Open'});

        if (response) {
            res.json({
                status: 200,
                message: response
            })
        } else {
            res.json({
                status: 404,
                message: "No Trips found"
            })
        }


    } catch (error) {
        res.json({
            status: 500,
            message: error.message
        })
    }
}


exports.startSingleShipment = async (req, res) => {
    try {
        const { shipmentOfferId } = req.body;

        const response = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Active' } }, { new: true })

        res.json({
            status: 200,
            message: response
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.getAllActiveShipmentsOfCarrier = async (req,res) =>{
try {
    
    const {carrierId} = req.body;

    const response = await ShipmentOrder.find({carrierId:carrierId,status:'Active'})
    

    if(response.length !== 0){
        res.json({
            status:200,
            message:true
        })
    }else{
        res.json({
            status:404,
            message:false
        })
    }
} catch (error) {
    res.json({
        status:500,
        message:error.message
    })
}
}


exports.pickupPackage = async (req, res) => {

    const { packageId } = req.body;

    try {

        const response = await Package.findByIdAndUpdate({ _id: packageId }, { $set: { packageStatus: 'picked_up' } }, { new: true })

        res.json({
            status: 200,
            message: response
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.uploadShipmentVerificationImage = async (req, res) => {
    try {
        const { shipmentOfferId, verificationImage } = req.body;

        const response = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { verificationImage: verificationImage } }, { new: true })

        res.json({
            status: 200,
            message: response
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.verifyShipment = async (req, res) => {
    try {
        const { shipmentOfferId } = req.body;



        const response = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { verified: 'true' } }, { new: true })

        const packageResponse = await Package.findByIdAndUpdate({ _id: response.packageId }, { $set: { packageStatus: 'delivery_in_progress' } })

        try {
            const accountResponse = await IndividualAccount.findOne({ _id: response.accountId });
            try {
                const userResponse = await User.findOne({ _id: accountResponse.userId });

                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your package delivery in progress`

                }

                let resMail = await sendMail(mail)

                res.json({
                    status: 200,
                    message: resMail
                })

            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.dropOff = async (req, res) => {
    try {
        const { shipmentOfferId } = req.body;

        const response = await ShipmentOrder.findOne({ _id: shipmentOfferId })

        const packageResponse = await Package.findByIdAndUpdate({ _id: response.packageId }, { $set: { packageStatus: 'dropped_off' } })

        try {
            const accountResponse = await IndividualAccount.findOne({ _id: response.accountId });
            try {
                const userResponse = await User.findOne({ _id: accountResponse.userId });

                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your package has been DropOff`

                }

                let resMail = await sendMail(mail)

                res.json({
                    status: 200,
                    message: resMail
                })

            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }

    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.confirmDropOff = async (req, res) => {
    try {
        const { shipmentOfferId } = req.body;

        const response = await ShipmentOrder.findByIdAndUpdate({ _id: shipmentOfferId }, { $set: { status: 'Completed' } }, { new: true })

        try {
            const accountResponse = await IndividualAccount.findOne({ _id: response.accountId });
            try {
                const userResponse = await User.findOne({ _id: accountResponse.userId });

                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your package has been DropOff`

                }

                let resMail = await sendMail(mail)

                res.json({
                    status: 200,
                    message: resMail
                })

            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }

}

exports.giveRating = async (req, res) => {
    try {
        const { accountId, rating } = req.body;

        const response = await IndividualAccount.findByIdAndUpdate({ _id: accountId }, { $set: { rating: rating } }, { new: true })

        res.json({
            status:200,
            message:response
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.countCarrierActiveShipment = async(req,res) =>{
   
    try {
        const{carrierId} = req.body;
        const response = await ShipmentOrder.find({carrierId:carrierId,status:'Active'});
        const countCarrierActiveshipment = response.length
        res.json({
            status:200,
            message:countCarrierActiveshipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            
        })
    }
}


exports.countShipperActiveShipment = async(req,res) =>{
    try {
        const {accountId} = req.body;
        const response = await ShipmentOrder.find({accountId:accountId,status:'Active'});
        const countCarrierShipperActiveshipment = response.length
        res.json({
            status:200,
            message:countCarrierShipperActiveshipment
        })
    } catch (error) {
    
            res.json({
                status:403,
                message:error.message
            })
        
    }
}

exports.countCarrierPendingShipment = async(req,res) =>{
    try {
        const {carrierId} = req.body;
        const response = await ShipmentOrder.find({carrierId:carrierId,status:'Pending'});
        const countCarrierPendingshipment = response.length
        res.json({
            status:200,
            message:countCarrierPendingshipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            
        })
    }
}


exports.countCarrierShipperPendingShipment = async(req,res) =>{
    try {
        const {accountId}= req.body;
        const response = await ShipmentOrder.find({accountId:accountId,status:'Pending'});
        const countCarrierShipperPendingShipment = response.length
        res.json({
            status:200,
            message:countCarrierShipperPendingShipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            })
        
    }
}

exports.countCarrierCompleteShipment = async(req,res) =>{
    try {
        var {carrierId} = req.body;
        const response = await ShipmentOrder.find({carrierId:carrierId,status:'Complete'});
        const countCarrierCompleteShipment = response.length
        res.json({
            status:200,
            message:countCarrierCompleteShipment
        })
    } catch (error) {
    
            res.json({
                status:403,
                message:error.message
            })
        
    }
}

exports.countCarrierShipperCompleteShipment = async(req,res) =>{
    try {
        var {accountId} = req.body;
        const response = await ShipmentOrder.find({accountId:accountId,status:'Complete'});
        const countCarrierShipperPendingShipment = response.length
        res.json({
            status:200,
            message:countCarrierShipperPendingShipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            })
        
    }
}

exports.countCarrierActiveTrips = async(req,res) =>{
    try {
        var {carrierId} = req.body;
        const response = await Trip.find({accountId:carrierId,status:'Pending'});
        const countCarrierShipperPendingShipment = response.length
        res.json({
            status:200,
            message:countCarrierShipperPendingShipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            })
        
    }
}

exports.countCarrierClosedTrips = async(req,res) =>{
    try {
        var {carrierId} = req.body;
        const response = await Trip.find({accountId:carrierId,status:'Close'});
        const countCarrierShipperPendingShipment = response.length
        res.json({
            status:200,
            message:countCarrierShipperPendingShipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            })
        
    }
}


exports.countCarrierCancelledTrips = async(req,res) =>{
    try {
        var {carrierId} = req.body;
        const response = await Trip.find({accountId:carrierId,status:'Cancel'});
        const countCarrierShipperPendingShipment = response.length
        res.json({
            status:200,
            message:countCarrierShipperPendingShipment
        })
    } catch (error) {
        
            res.json({
                status:403,
                message:error.message
            })
        
    }
}



