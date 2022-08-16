const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { generateAccessToken } = require('../Utils/jwt');
const { sendMail } = require('../Utils/nodemailer');
const IndividualAccount = require('../Model/IndividualAccount');
const VerificationCode = require('../Model/VerificationCode');
const BusinessAccount = require('../Model/BusinessAccount');
const Vehicle = require('../Model/Vehicle');
const ResetPassword = require('../Model/ResetPassword');
const ResetPasswordMobile = require('../Model/ResetPasswordMobile.js');
const AccountRequest = require('../Model/AccountRequest');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
        res.json({
            status: 409,
            mesaage: "Email already exist"
        })
    }
    else {

        const newUser = new User({ username, email, password });

        bcrypt.genSalt(saltRounds, async function (err, salt) {

            bcrypt.hash(password, salt, async function (err, hash) {

                newUser.password = hash

                try {
                    let response = await newUser.save()


                    res.json({
                        status: 200,
                        message: {
                            username: response.username,
                            id: response._id,
                            email: response.email
                        }
                    })

                } catch (error) {
                    res.json({
                        status: 400,
                        message:error.message
                    })
                }
            })
        })
    }
}


exports.buildIndividualAccount = async (req, res) => {
    const { userId, firstName, lastName, dateOfBirth, gender, cnic, street, town, city, province, phoneNumber, profilePic } = req.body;
    const user = await User.findOne({ _id: userId });
    // const phoneCode = Math.floor(Math.random() * 9000);

    const emailCode = Math.floor(Math.random() * 9000);

    const newAccount = await IndividualAccount({ userId, firstName, lastName, dateOfBirth, gender, cnic, street, town, city, province, phoneNumber, rating: '0.0', profilePic, shipperRole: true, carrierRole: false });

    try {
        const response = await newAccount.save();

        if (response._id) {

            try {
                const newCode = await VerificationCode({
                    // phoneCode,
                    emailCode,
                    accountId: response._id

                })

                const responseCode = await newCode.save();

                // const msgRes = await sendSMS({ to: response.phoneNumber, message: `Your verification code for shipIt account is ${responseCode.phoneCode}` });


                const mail = {
                    to: user.email,
                    from: `${process.env.GMAIL_USER}`,
                    text: `Your verification code for shipIt account is ${responseCode.emailCode}`
                }
                let resMail = await sendMail(mail);


                res.json({
                    status: 200,
                    message: {
                        userName: user.username,
                        email: user.email,
                        account: response
                    }
                })

            } catch (error) {
                res.json({
                    status: 400,
                    message:error.message
                })
            }
        } else {
            res.json({
                status: 500,
                message:error.message
            })
        }

    } catch (error) {
        res.json({
            status: 500,
            mesaage: error
        })
    }

}

// exports.buildBusinessAccount = async (req, res) => {
//     const { userId, accountType, businessName, street, town, city, province, phoneNumber, profilePic } = req.body;

//     const user = await User.findOne({ _id: userId });

//     const phoneCode = Math.floor(Math.random() * 9000);

//     const emailCode = Math.floor(Math.random() * 9000);

//     const newAccount = await BusinessAccount({ userId, accountType, businessName, street, town, city, province, phoneNumber, profilePic });

//     try {
//         const response = await newAccount.save();

//         if (response._id) {
//             try {
//                 const newCode = await VerificationCode({
//                     phoneCode,
//                     emailCode,
//                     accountId: response._id
//                 })
//                 const responseCode = await newCode.save();

//                 const msgRes = await sendSMS({ to: response.phoneNumber, message: `Your verification code for shipIt account is ${responseCode.phoneCode}` });


//                 const mail = {
//                     to: user.email,
//                     from: `${process.env.GMAIL_USER}`,
//                     text: `Your verification code for shipIt account is ${responseCode.emailCode}`
//                 }
//                 let resMail = await sendMail(mail);

//                 res.json({
//                     status: 200,
//                     message: {
//                         accountId: response._id,
//                         userId: response.userId,
//                         accountType: response.accountType,
//                         businessName: response.businessName,
//                         street: response.street,
//                         town: response.town,
//                         city: response.city,
//                         province: response.province,
//                         phoneNumber: response.phoneNumber,
//                         profilePic:response.profilePic,
//                         verified: response.verified

//                     }
//                 })
//             } catch (error) {
//                 res.json({
//                     status: 400,
//                     message:error.message
//                 })
//             }
//         } else {
//             res.json({
//                 status: 400,
//                 message:error.message
//             })
//         }


//     } catch (error) {
//         res.json({
//             status: 500,
//             message:error.message
//         })
//     }


// }

exports.verify = async (req, res) => {
    const { accountId,  emailCode } = req.body;

    const code = await VerificationCode.findOne({ accountId: accountId })

    const individualAccount = await IndividualAccount.findOne({ _id: accountId });


    if (individualAccount) {


        const user = await User.findOne({ _id: individualAccount.userId })


        if (code.emailCode !== emailCode ) {
            res.json({
                status: 402,
                message: "Incorrect Code"
            })
        } else {
            individualAccount.verified = true

            let response = await individualAccount.save()
            // Individual fields + JWT TOken
            const jwt = await generateAccessToken(user.email, process.env.SECRET_KEY);
            res.json({
                status: 200,
                message: {
                    userName: user.username,
                    email: user.email,
                    account: response,
                    token: jwt

                }

            })
        }
    } else {
        const businessAccount = await BusinessAccount.findOne({ _id: accountId })

        if (businessAccount) {
            const user = await User.findOne({ _id: businessAccount.userId })
            console.log(user);
            if (code.emailCode !== emailCode) {
                res.json({
                    status: 402,
                    message: "Incorrect Code"
                })
            } else {
                businessAccount.verified = true

                let response = await businessAccount.save()
                // Business fields + JWT
                const jwt = await generateAccessToken(user.email, process.env.SECRET_KEY);
                res.json({
                    status: 200,
                    message: {
                        userId: response.userId,
                        accountId: response.accountId,
                        accountType: response.accountType,
                        businessName: response.bussinessName,
                        street: response.street,
                        town: response.town,
                        city: response.city,
                        province: response.province,
                        phoneNumber: response.phoneNumber,
                        profilePic: response.profilePic,
                        verified: response.verified,
                        token: jwt

                    }
                })
            }
        } else {
            res.json({
                status: 404,
                message: "Account not found"
            })
        }
    }
}

exports.resendVerificationCode = async (req,res) =>{

    const { accountId } = req.body;

    try {


        const response = await IndividualAccount.findOne({_id: accountId});

        try {

            const user = await User.findOne({_id: response.userId});

            try {
    
                const emailCode = Math.floor(Math.random() * 9000);
        
                try {
                    const newCode = await VerificationCode({
                     
                        emailCode,
                        accountId: response._id
                    })

                    try {
                        const responseCode = await newCode.save()
            
                        // await sendSMS({ to: response.phoneNumber, message: `Your verification code for shipIt account is ${responseCode.phoneCode}` });
                
                
                        const mail = {
                            to: user.email,
                            from: `${process.env.GMAIL_USER}`,
                            text: `Your verification code for shipIt account is ${responseCode.emailCode}`
                        }

                        await sendMail(mail);

                        res.json({
                            status:200,
                            mesaage: "New code sent."
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


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email: email });


        if (!user) {
            res.json({
                status: 404,
                message: "User not found"
            })
        } else {
            const result = await bcrypt.compare(password, user.password)

            if (result === true) {

                const individualAccount = await IndividualAccount.findOne({ userId: user._id })

                const businessAccount = await BusinessAccount.findOne({ userId: user._id })

                if (!individualAccount && businessAccount) {
                    const j = generateAccessToken(user.email, process.env.SECRET_KEY);
                    res.json({
                        status: 200,
                        message:{
                            userId: user._id,
                            email: user.email,
                            account: businessAccount,
                            token: j

                        } 
                    })
                } else if (individualAccount && !businessAccount) {
                    const j = generateAccessToken(user.email, process.env.SECRET_KEY);
                    res.json({
                        status: 200,
                        message:{
                            userId: user._id,
                            email: user.email,
                            account: individualAccount,
                            token: j

                        } 
                    })
                } else{
                    res.json({
                        status: 403,
                        message: 'Account doesnt exist',
                        userId: user._id,
                    })
                } 


            } else {
                res.json({
                    status: 402,
                    message: "Incorrect password"
                })
            }

        }

    } catch (err) {
        res.json({
            status: 500,
            message: err
        })
    }
}




exports.findOrCreateCarrierRole = async (req, res) => {

    const { accountId } = req.body;

    try {
        const account = await IndividualAccount.findOne({ _id: accountId });

        if (account.carrierRole === true) {

            const carrierVehicles = await Vehicle.find({ accountId: accountId._id })

            res.json({
                status: 200,
                message: account,
                carrierVehicles: carrierVehicles
            })

        } else {


            const carrierRole = await AccountRequest.findOne({accountId: accountId})

            if(carrierRole){
                res.json({
                    status:405,
                    message:"You request is under process."
                })
            }else{

                try {
                    const newRole = await AccountRequest({accountId: accountId})
                    const roleResponse = await newRole.save()

                    res.json({
                        status:201,
                        message:"Your request has been recieved."
                    })
                } catch (error) {
                    res.json({
                        status:500,
                        message:error.mesaage
                    })
                }
                
            }

            // const updatedAccount = await IndividualAccount.findOneAndUpdate({ _id: accountId }, { $set: { carrierRole: true } }, { new: true });


            // res.json({
            //     status: 200,
            //     message: updatedAccount,
            // })
        }
    } catch (error) {
        res.json({
            status: 500,
            message:error.message
        })
    }

}




exports.forgetPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email: email });

        if (!user) {
            res.json({
                status: 404,
                message: "User with this email does not exist"
            })
        }

        else {

            const resetPassword = new ResetPassword({ email: email })

            const response =  await resetPassword.save();

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
            message:error.message
        })
    }
}


exports.forgetPasswordMobile = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email: email });

        if (!user) {
            res.json({
                status: 404,
                message: "User with this email does not exist"
            })
        }

        else {
            const code = Math.floor(999 + Math.random() * 9000);

            const ResetPasswordmobile = new ResetPasswordMobile({ email: email,code:code })

            const response =  await ResetPasswordmobile.save();


            let mail = {
                to: email,
                from: `${process.env.GMAIL_USER}`,
                text: `Your verification Code is : ${code}`

            }

            let resMail = await sendMail(mail)

            res.json({
                status: 200,
                message: code,

            })
        }

    } catch (error) {

        res.json({
            status: 500,
            message:error.message
        })
    }
}


exports.checkresetpasswordCode = async (req, res) => {
    const { id } = req.body;

    try {
        const resetPasswordCode = await ResetPassword.findOne({ _id: id });
        if (!resetPasswordCode) {
            res.json({
                status: 404,
                message: "invalid user"
            })
        }
        else {
            res.json({
                status: 200,
                message: "Approved"
            })
        }


    } catch (error) {
        res.json({
            status: 500,
            message:error.message
        })
    }
}


exports.resetUserPassword = async (req, res) => {

    let { code , password } = req.body;

    const email = await ResetPassword.findOne({_id: code});

    bcrypt.genSalt(saltRounds, async function (err, salt) {

        bcrypt.hash(password, salt, async function (err, hash) {

            password = hash;

            try {
                const response = await User.findOneAndUpdate({ email: email.email }, { $set: { password: hash } }, { new: true });
                res.json({
                    status: 200,
                    message: "Password Reset Succcessfully"
                })
            } catch (error) {
                res.json({
                    status: 500,
                    message:error.message
                })
            }
        })

    })


    
}


exports.resetUserPasswordMobile = async (req, res) => {

    let { code , password } = req.body;

    const codeInstance = await ResetPasswordMobile.findOne({code: code});

    bcrypt.genSalt(saltRounds, async function (err, salt) {

        bcrypt.hash(password, salt, async function (err, hash) {

            password = hash;

            try {
                const response = await User.findOneAndUpdate({ email: codeInstance.email }, { $set: { password: hash } }, { new: true });
                res.json({
                    status: 200,
                    message: "Password Reset Succcessfully"
                })
            } catch (error) {
                res.json({
                    status: 500,
                    message:error.message
                })
            }
        })

    })


    
}



exports.getUserById = async ( req , res ) =>{

    const { accountId } = req.body;

    try {
        const profile = await IndividualAccount.findOne({_id: accountId})

        res.json({
            status:200,
            message: profile
        })
    } catch (error) {
        res.json({
            status:500,
            message: error.message
        })
    }

}

exports.editProfile = async (req,res) =>{
    const { accountId , firstName, lastName, street, town, city, province } = req.body;

    try {
        const updatedProfile = await IndividualAccount.findOneAndUpdate({_id: accountId} , {$set:{firstName : firstName, lastName: lastName,  street : street , town : town, city : city, province : province }})

        res.json({
            status:200,
            message: updatedProfile
        })
    } catch (error) {
        res.json({
            status:500,
            message: error.message
        })
    }
}