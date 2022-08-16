const Auction = require("../Model/Auction");
const Package = require("../Model/Package");
const Bid = require("../Model/Bid");
const ShipmentOrder = require("../Model/ShipmentOrder");
const moment = require("moment");
const Chat = require("../Model/Chat");
const User = require ('../Model/User');
const IndividualAccount = require('../Model/IndividualAccount');
const {sendMail} = require('../Utils/nodemailer');

exports.createAuction = async (req, res) => {
  try {
    const {
      accountId,
      auctionDuration,
      startingBid,
      pickupDate,
      pickupTime,
      pickupAddress,
      pickupCity,
      dropOffDate,
      dropOffTime,
      dropOffAddress,
      dropOffContactName,
      dropOffContactNumber,
      pickupLattitude,
      pickupLongitude,
      dropOffLattitude,
      dropOffLongitude,
      destinationAddress,
      destinationCity,
      packageWidth,
      packageHeight,
      packageWeight,
      packageType,
      packageWorth,
      fragile,
      packageImageUrl,
    } = req.body;

    const package = await Package({
      packageWeight,
      packageType,
      packageWorth,
      fragile,
      packageStatus: "NOT_PICKED_UP",
      packageImageUrl,
      packageWidth,
      packageHeight,
    });

    const packageResponse = await package.save();

    try {
      const auction = await Auction({
        accountId,
        packageId: packageResponse._id,
        auctionDuration,
        startingBid,
        pickupDate,
        pickupTime,
        pickupAddress,
        pickupCity,
        dropOffDate,
        dropOffTime,
        dropOffAddress,
        dropOffContactName,
        dropOffContactNumber,
        destinationAddress,
        destinationCity,
        pickupLattitude,
        pickupLongitude,
        dropOffLattitude,
        dropOffLongitude,
        status: "Open",
      });

      const response = await auction.save();

      res.json({
        status: 200,
        message: {
          auction: response,
          package: packageResponse,
        },
      });
    } catch (error) {
      res.json({
        status: 403,
        message: error.message,
      });
    }
  } catch (error) {
    res.json({
      status: 402,
      message: error.message,
    });
  }
};

exports.createBid = async (req, res) => {
  try {
    const { auctionId, carrierId, bidAmount , vehicleId } = req.body;

    const newBid = new Bid({ carrierId, auctionId, bidAmount , vehicleId });

    const response = await newBid.save();

    //console.log(response);

    try {
      const auctionResponse = await Auction.findByIdAndUpdate(
        { _id: auctionId },
        { $push: { bids: { response } } },
        { new: true }
      );

      //console.log(auctionResponse);
      
      try {
        const accountResponse = await IndividualAccount.findOne({_id:auctionResponse.accountId})

      try {
        const userResponse = await User.findOne({_id:accountResponse.userId});

        let mail = {
          to: userResponse.email,
          from: `${process.env.GMAIL_USER}`,
          text: `Your bid has been accepted please visit loadingo page to accept or reject`

      }

      let resMail = await sendMail(mail)

      res.json({
        status:200,
        message:resMail
      })


      } catch (error) {

        res.json({
          status:403,
          message:error.message
        })
        
      }
      } catch (error) {
        res.json({
          status:404,
          message:error.message
        })
      }
      
    } catch (error) {
      res.json({
        status: 403,
        message: error.message,
      });
    }
  } catch (error) {
    res.json({
      status: 402,
      message: error.message,
    });
  }
};

exports.terminateAuction = async (req, res) => {
  const { auctionId } = req.body;

  try {
    const response = await Auction.findOneAndUpdate(
      { _id: auctionId },
      { $set: { status: "close" } },
      { new: true }
    );

    console.log(response);

    res.json({
      status: 200,
      message: response,
    });
  } catch (error) {
    res.json({
      status: 403,
      message: error.message,
    });
  }
};

// exports.closeAuction = async (req, res) => {
//     try {
//         const { auctionId } = req.body;

//         const auction = await Auction.findOne({ _id: auctionId });

//         var arr = [];

//         await auction.bids.forEach(async bid => {
//             const getBid = await Bid.findOne({ bidId: bid.bidId })
//              arr.push(bid.getBid)
//             console.log(getBid);

//         })

//     } catch (error) {
//         console.log(error)
//     }
// }

exports.chooseBid = async (req, res) => {
  const { auctionId, bidId } = req.body;

  try {
    const auctionResponse = await Auction.findOneAndUpdate(
      { _id: auctionId },
      { $set: { status: "On Hold" } },
      { new: true }
    );

    console.log(auctionResponse);

    try {
      const bid = await Bid.findOne({ _id: bidId });

      try {
        let creationTime = moment().format("LT");

        let expiryTime = moment(creationTime, "hh:mm A")
          .add(15, "minutes")
          .format("LT");

        const newShipmentRequest = await ShipmentOrder({
          accountId: auctionResponse.accountId,
          createdFrom:'Auction',
          carrierId: bid.carrierId,
          packageId: auctionResponse.packageId,
          destinationAddress: auctionResponse.destinationAddress,
          destinationCity: auctionResponse.destinationCity,
          dropOffContactNumber: auctionResponse.dropOffContactNumber,
          dropOffContactName: auctionResponse.dropOffContactName,
          pickupAddress: auctionResponse.pickupAddress,
          pickupCity: auctionResponse.pickupCity,
          pickupDate: auctionResponse.pickupDate,
          pickupLongitude: auctionResponse.pickupLongitude,
          pickupLattitude: auctionResponse.pickupLattitude,
          dropOffLongitude: auctionResponse.dropOffLongitude,
          dropOffLattitude: auctionResponse.dropOffLattitude,
          shipmentCreationTime: creationTime,
          shipmentExpiryTime: expiryTime,
          status: "Pending",
        });

        const shipmentResponse = await newShipmentRequest.save();

        res.json({
          status: 200,
          message: shipmentResponse,
        });

        try {
            let response = await Auction.findByIdAndUpdate({_id:auctionId},{$set:{shipmentOfferId:newShipmentRequest._id,choosenCarrierId:newShipmentRequest.carrierId}},{new:true});
        
        try {
          const accountResponse = await IndividualAccount.findOne({_id:response.accountId})

        try {
          const userResponse = await User.findOne({_id:accountResponse.userId});

          let mail = {
            to: userResponse.email,
            from: `${process.env.GMAIL_USER}`,
            text: `Your bid has been accepted please visit loadingo page to accept or reject`

        }

        let resMail = await sendMail(mail)

        res.json({
          status:200,
          message:resMail
        })


        } catch (error) {

          res.json({
            status:403,
            message:error.message
          })
          
        }
        } catch (error) {
          res.json({
            status:404,
            message:error.message
          })
        }

           
        } catch (error) {
            res.json({
                status:500,
                message:error.message
            })
        }
      } catch (error) {
        res.json({
          status: 500,
          message: error.message,
        })}
      } catch (error) {
        res.json({
          status: 500,
          message: error.message,
        })}
      } catch (error) {
        res.json({
          status: 500,
          message: error.message,
        })}
}

exports.updateBid = async (req,res) =>{
  const {bidId,bidAmount} = req.body;

  try {
    const response = await Bid.findByIdAndUpdate({_id:bidId},{$set:{bidAmount:bidAmount}},{new:true});

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

exports.getAuctionById = async (req,res) =>{
   
    const {auctionId} = req.body;
   
    try {
  
        const auctionData = await Auction.findById({_id:auctionId});

        const packageData = await Auction.findById({_id:auctionData.packageId});

        res.json({
            status:200,
            message:{
                auctionData,
                packageData
            }
        })
    } catch (error) {
      res.json({
        status: 500,
        message: error.message,
      })
    }
  } 

exports.getAllAuctions = async (req, res) => {
  try {
    const response = await Auction.find();

    res.json({
      status: 200,
      message: {
        auctions: response,
      },
    });
  } catch (error) {
    res.json({
      status: 403,
      message: error,
    });
  }
};
   
exports.getAllOpenAuctions = async (req, res) => {
  try {
    const response = await Auction.find({status : 'Open'});

    res.json({
      status: 200,
      message: {
        auctions: response,
      },
    });
  } catch (error) {
    res.json({
      status: 403,
      message: error,
    });
  }
};

exports.getAuctionById = async (req, res) => {
  const { auctionId } = req.body;

  try {
    const auctionData = await Auction.findById({ _id: auctionId });
    const packageData = await Package.findById({ _id: auctionData.packageId });

    res.json({
      status: 200,
      message: { auctionData, packageData },
    });
  } catch (error) {
    res.json({
      status: 403,
      message: error.message,
    });
  }
};

exports.getAuctionByUser = async (req, res) => {
  const { accountId } = req.body;

  try {
    const auctionsList = await Auction.find({ accountId: accountId });

    res.json({
      status: 200,
      message: auctionsList,
    });
  } catch (error) {
    res.json({
      status: 403,
      message: error.message,
    });
  }
};

// exports.chooseBid = async (req,res) =>{
//     const {bidId,auctionId,carrierId} = req.body;

//     try {

//         const responseBid = await Bid.findOne({_id:bidId});

//         try {
//             const responseAuction = await Auction.findByIdAndUpdate({_id:auctionId},{$set:{status:'OnHold'}},{new:true});

//             res.json({
//                 status:200,
//                 message:{
//                     Bid:responseBid,
//                     Auction:responseAuction
//                 }
//             })
//         } catch (error) {
//           res.json({
//               status:403,
//               message:error.message
//           })
//         }

//     } catch (error) {
//         res.json({
//             status:403,
//             message:error.message
//         })
//     }
// }

exports.acceptShipmentOffer = async (req, res) => {
  const { auctionId, shipmentId } = req.body;

  try {
    const response = await Auction.findOneAndUpdate(
      { _id: auctionId },
      { $set: { status: "Closed" } },
      { new: true }
    );
    
    const updatedShipmentOffer = await ShipmentOrder.findOneAndUpdate(
      { _id: shipmentId },
      { $set: { status:'Waiting' } },
      {new: true}
    );

      try {
  
        const newChatRoom = await Chat({
          user1: updatedShipmentOffer.accountId,
          user2: updatedShipmentOffer.carrierId,
        });

        const newChatRoomResponse = await newChatRoom.save();

        try {
          const newUpdatedShipmentOffer = await ShipmentOrder.findOneAndUpdate(
            { _id: shipmentId },
            { $set: { chatRoomId: newChatRoomResponse._id } }
          );

          try {
            const accountResponse = await IndividualAccount.findOne({_id:newUpdatedShipmentOffer.accountId});

            try {
              const userResponse = await User.findOne({_id:accountResponse.userId});

              let mail = {
                to: userResponse.email,
                from: `${process.env.GMAIL_USER}`,
                text: `Your shipment offer has been accepted from carrier`
    
            }
    
            let resMail = await sendMail(mail)
            
            res.json({
              status: 200,
              message: {
                AuctionShipmentOffer: response,
                updatedShipmentOffer: newUpdatedShipmentOffer,
                resMail:resMail
              },
            });

            } catch (error) {
              res.json({
                status:403,
                message:error.message
              })
            }
          } catch (error) {
            res.json({ status:405,
              message:error.message
            })
           
          }

        
        } catch (error) {
          res.json({
            status: 500,
            message: error.message,
          });
        }
      } catch (error) {
        res.json({
          status: 500,
          message: error.message,
        });
      }
    
  } catch (error) {
    res.json({
      status: 403,
      message: error.message,
    });
  }
};

exports.rejectShipmentOffer = async (req, res) => {
  const { auctionId, shipmentOrderId } = req.body;

  try {
    const response = await Auction.findByIdAndUpdate(
      { _id: auctionId },
      { $set: { status: "Open" } },
      { new: true }
    );

    try {
      const shipmentOrder = await ShipmentOrder.findOneAndDelete({
        _id: shipmentOrderId,
      });

      try {
        const accountResponse = await IndividualAccount.findOne({_id:shipmentOrder.accountId});

        try {
          const userResponse = await User.findOne({_id:accountResponse.userId});

          let mail = {
            to: userResponse.email,
            from: `${process.env.GMAIL_USER}`,
            text: `Your shipment offer has been rejected and deleted`

        }

        let resMail = await sendMail(mail)

        res.json({
          status: 200,
          message: resMail,
        });


        } catch (error) {
          res.json({
            status:403,
            message:error.message
          })
        }
      } catch (error) {
        res.json({
          status:404,
          message:error.message
        })
      }

     
    } catch (error) {
      res.json({
        status: 500,
        message: error.message,
      });
    }
  } catch (error) {
    res.json({
      status: 403,
      message: error.message,
    });
  }
};

exports.getShipmentById = async (req,res) =>{
    const {shipmentOfferId} = req.body;
    
    try {
        const response = await ShipmentOrder.findById({_id:shipmentOfferId});

        res.json({
            status:200,
            message:response
        })
    } catch (error) {
        res.json({
            status:500,
            message:error.message
        })
    }
}
