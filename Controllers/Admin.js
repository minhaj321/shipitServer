const Admin = require('../Model/Admin');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { generateAccessToken } = require('../Utils/jwt');

const ResetPassword = require('../Model/ResetPassword')

const { sendMail } = require('../Utils/nodemailer');


const Trip = require('../Model/Trip');

const IndividualAccount = require('../Model/IndividualAccount');

const Auction = require('../Model/Auction');

const ShipmentOrder = require('../Model/ShipmentOrder');

const Vehicle = require('../Model/Vehicle');

const Complaint = require('../Model/Complaint');

const AccountRequest = require('../Model/AccountRequest');

const User = require('../Model/User');


const saltRounds = 10;

exports.createAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (admin) {
        res.json({
            status: 409,
            message: 'Email Already Exist'
        })
    } else {
        const newUser = new Admin({ username, email, password });

        bcrypt.genSalt(saltRounds, async function (err, salt) {

            bcrypt.hash(password, salt, async function (err, hash) {

                newUser.password = hash

                try {
                    let response = await newUser.save();

                    console.log(response);

                    res.json({
                        status: 200,
                        message: {
                            id: response._id,
                            userName: response.username,
                            email: response.email,
                            password: response.password

                        }
                    })
                } catch (error) {
                    res.json({
                        status: 400,
                        message: error
                    })
                }
            })

        })




    }
}



exports.adminLogin = async (req, res) => {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
        res.json({
            status: 404,
            message: 'User Not Found'
        })
    } else {
        const result = await bcrypt.compare(password, admin.password);

if(result){
    const jwt = generateAccessToken(admin.email, process.env.SECRET_KEY);

    res.json({
        status: 200,
        message: {
            email: admin.email,
            password: admin.password,
            token: jwt,
            _id:admin._id
        }
    })
}else{
    res.json({
        status:410,
        message:'Password Incorrect'
    })
}
    }
}

exports.adminFogetPassword = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await Admin.findOne({ email: email });

        if (!user) {
            res.json({
                status: 404,
                message: "User with this email does not exist"
            })
        }

        else {

            const resetPassword = new ResetPassword({ email: email })

            const response = await resetPassword.save();

            const link = `http://localhost:3000/reset-password/${response._id}`;

            let mail = {
                to: email,
                from: `${process.env.GMAIL_USER}`,
                text: `You have requested to reset your password. Please, click on this link: ${link}`

            }

            let resMail = await sendMail(mail)

            res.json({
                status: 200,
                message: link,

            })
        }

    } catch (error) {

        res.json({
            status: 500,
            message: error.message
        })
    }
}

exports.adminResetPassword = async (req, res) => {

    let { code, password } = req.body;

    const email = await ResetPassword.findOne({ _id: code });

    bcrypt.genSalt(saltRounds, async function (err, salt) {

        bcrypt.hash(password, salt, async function (err, hash) {

            password = hash;

            try {
                const response = await Admin.findOneAndUpdate({ email: email.email }, { $set: { password: hash } }, { new: true });
                res.json({
                    status: 200,
                    message: "Password Reset Succcessfully"
                })
            } catch (error) {
                res.json({
                    status: 500,
                    message: error.message
                })
            }
        })

    })
}

exports.approveVehicleRequest = async (req,res) =>
{
    const {vehicleId} = req.body;
 
    try {
        const response = await Vehicle.findByIdAndUpdate({_id:vehicleId},{$set:{status:'Active'}},{new:true});

        try {
            const accountResponse = await IndividualAccount.findOne({_id:response.accountId})

            try {
                const userResponse = await User.findOne({_id:accountResponse.userId})

                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your vehicle request has been approved`
          
                }
          
                let resMail = await sendMail(mail)
                res.json({
                    status:200,
                    message:resMail
                })
            } catch (error) {
               res.json({
                   status:500,
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
            status:404,
            message:error.message
        })
        
    }


}



exports.declineVehicleRequest = async (req,res) =>
{
    const {vehicleId} = req.body;
 
    try {
        const response = await Vehicle.findByIdAndDelete({_id:vehicleId});

        try {
            const accountResponse = await IndividualAccount.findOne({_id:response.accountId})

            try {
                const userResponse = await User.findOne({_id:accountResponse.userId})

                let mail = {
                    to: userResponse.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your vehicle request has been rejected`
          
                }
          
                let resMail = await sendMail(mail)
                res.json({
                    status:200,
                    message:resMail
                })
            } catch (error) {
               res.json({
                   status:500,
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
            status:404,
            message:error.message
        })
        
    }


}


exports.getAllUsers = async (req, res) => {

    try {
        const totalUsers = await IndividualAccount.find();

        const totalUserCount = totalUsers.length


        res.json({
            status: 200,
            message: {
                totalUserCount: totalUserCount
            }
        })

    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}

exports.getAllCarriers = async (req, res) => {

    try {
        const totalCarriers = await IndividualAccount.find({ carrierRole: true });

        const totalCarrierCount = totalCarriers.length

        res.json({
            status: 200,
            message: {
                totalCarrierCount: totalCarrierCount
            }
        })
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}

exports.getAllShippers = async (req, res) => {
    try {
        const totalShippers = await IndividualAccount.find({ shipperRole: true });

        const totalShippersCount = totalShippers.length

        res.json({
            status: 200,
            message: {
                totalShippersCount: totalShippersCount
            }
        })
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}

exports.getAllActiveAuction = async (req, res) => {
    try {
        const totalActiveAuction = await Auction.find({ status: 'Open' })

        const totalActiveAuctionCount = totalActiveAuction.length

        res.json({
            status: 200,
            message: {
                totalActiveAuctionCount: totalActiveAuctionCount
            }
        })
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}

exports.getAllActiveTrip = async (req, res) => {
    try {
        const totalActiveTrip = await Trip.find({ status: 'Pending' })

        const totalActiveTripCount = totalActiveTrip.length

        res.json({
            status: 200,
            message: {
                totalActiveTripCount: totalActiveTripCount
            }
        })
    } catch (error) {
        res.json({
            status: 404,
            message: error.message
        })
    }
}

exports.getAllShipment = async (req, res) => {

    try {
        const totalShipment = await ShipmentOrder.find();

        const totalShipmentCount = totalShipment.length

        res.json({
            status: 200,
            message: {
                totalShipmentCount: totalShipmentCount
            }
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.getAllActiveShipment = async (req, res) => {

    try {
        const totalActiveShipment = await ShipmentOrder.find({ status: 'Active' })

        const totalActiveShipmentCount = totalActiveShipment.length

        res.json({
            status: 200,
            message: {
                totalActiveShipmentCount: totalActiveShipmentCount
            }
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.cancelShipment = async (req, res) => {

    try {
        const response = await ShipmentOrder.find({ status: 'Cancel' });

        const totalCancelShipment = response.length

        res.json({
            status: 200,
            message: totalCancelShipment

        })
    } catch (error) {

        res.json({
            status: 403,
            message: error.message
        })

    }

}

exports.countGetAllVehicle = async (req, res) => {

    try {
        const response = await Vehicle.find()

        const countGetAllVehicle = response.length

        res.json({
            status: 200,
            message: countGetAllVehicle
        })
    } catch (error) {
        res.json({
            status: 403,
            message: error.message
        })
    }
}

exports.countGetAllComplaint = async (req, res) => {

    try {
        const response = await Complaint.find();

        const countAllComplaint = response.length

        res.json({
            status: 200,
            message: countAllComplaint
        })
    } catch (error) {

        res.json({
            status:403,
            message:403
        })

    }
}

exports.countAccountRequest = async (req,res) =>{

    try {
        const response = await AccountRequest.find();
        
        const countAccountRequest = response.length

        res.json({
            status:200,
            message:countAccountRequest
        })


    } catch (error) {
        res.json({
            status:403,
            message:error.message
        })
    }
}

