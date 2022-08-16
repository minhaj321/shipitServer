const Complaint = require('../Model/Complaint');

const Package = require('../Model/Package');

const IndividualAccount = require('../Model/IndividualAccount');

const User = require('../Model/User');

const ShipmentOrder = require('../Model/ShipmentOrder');

const {sendMail} = require('../Utils/nodemailer');

exports.createComplaint = async (req, res) => {
    try {
        const { shipperId, carrierId, shipmentId, packageId, chatroomId, complaintTitle, complaintDescription } = req.body;

        const newComplaint = new Complaint({ shipperId, carrierId, shipmentId, packageId, chatroomId, complaintTitle, complaintDescription, status: 'Open' });

        const response = await newComplaint.save();

        try {
            const shipper = await IndividualAccount.findOne({_id:response.shipperId});
            
            const shipperUser = await User.findOne({_id:shipper.userId});

        try {
            const carrier = await IndividualAccount.findOne({_id:response.carrierId})
            
            const carrierUser = await User.findOne({_id:carrier.userId})

            try {
                let mail1 = {
                    to: shipperUser.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `A new complaint case has been registered`

                }

                let resMail1 = await sendMail(mail1) 

                try {
                    let mail2 = {
                        to: shipperUser.email,
                        from: `${process.env.GMAIL_USER}`,
                        text: `A new complaint case has been registered`

                    }

                    let resMail2 = await sendMail(mail2)
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

        res.json({
            status: 200,
            message: {
                complaintId: response._id,
                shipperId: response.shipperId,
                carrierId: response.carrierId,
                packageId: response.packageId,
                shipmentId: response.shipmentId,
                chatroomId: response.chatroomId,
                complaintTitle: response.complaintTitle,
                complaintDescription: response.complaintDescription,
                status: response.status
            }
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error
        })

    }


}

exports.viewComplaint = async (req, res) => {
    try {
        const response = await Complaint.find();

        if (response) {
            res.json({
                status: 200,
                message: response
            })
        }
        else {
            res.json({
                status: 404,
                message: "No Complaint Found"
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            message: error
        })
    }
}

exports.viewComplaintById = async (req, res) => {
    const { complaintId } = req.body;

    try {
        const complaintResponse = await Complaint.findOne({ _id: complaintId });

        try {
            const packageResponse = await Package.findOne({ _id: complaintResponse.packageId });


            try {
                const carrierResponse = await IndividualAccount.findOne({ _id: complaintResponse.carrierId });


                try {
                    const shipperResponse = await IndividualAccount.findOne({ _id: complaintResponse.shipperId });
                    try {

                        const shipmentResponse = await ShipmentOrder.findOne({ _id: complaintResponse.shipmentId })

                        res.json({
                            status: 200,
                            message: {
                                complaint: complaintResponse,
                                shipper: shipperResponse,
                                carrier: carrierResponse,
                                package: packageResponse,
                                shipment: shipmentResponse
                            }
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
}



exports.giveDecision = async (req, res) => {
    const { complaintId, winnerId, winnerName, reason } = req.body;

    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate({ _id: complaintId }, { $set: { status: 'Close' } }, { new: true });

        try {
            const shipper = await IndividualAccount.findOne({ _id: updatedComplaint.shipperId });

            const shipperUser = await User.findOne({ _id: shipper.userId })
            console.log(shipperUser);

            try {
                const carrier = await IndividualAccount.findOne({ _id: updatedComplaint.carrierId });

                const carrierUser = await User.findOne({ _id: carrier.userId });

                try {
                    let mail1 = {
                        to: shipperUser.email,
                        from: `${process.env.GMAIL_USER}`,
                        text: `The result of the complaint have been updated. The ${winnerName} ${winnerId} has won the dispute. The reason given is: "${reason}"`

                    }

                    let resMail1 = await sendMail(mail1)


                    try {
                        let mail2 = {
                            to: carrierUser.email,
                            from: `${process.env.GMAIL_USER}`,
                            text: `The result of the complaint have been updated. The ${winnerName} ${winnerId} has won the dispute. The reason given is: "${reason}"`

                        }

                        let resMail2 = await sendMail(mail2)

                        res.json({
                            status: 200,
                            message: {
                                mail1: resMail1,
                                mail2: resMail2
                            }
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
            status: 404,
            message: error.message
        })
    }
}


exports.deleteComplaint = async (req, res) => {
    const { complaintId } = req.body;

    try {
        const deletedComplaint = await Complaint.findByIdAndDelete({ _id: complaintId });

        res.json({
            status: 200,
            message: 'Complaint deleted successfully'
        })
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}