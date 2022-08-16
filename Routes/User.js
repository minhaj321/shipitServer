const express = require ('express');

const { resetUserPasswordMobile,forgetPasswordMobile,register,login , verify, buildIndividualAccount, buildBusinessAccount, findOrCreateCarrierRole, forgetPassword , checkresetpasswordCode , resetUserPassword, getUserById, editProfile} = require('../Controllers/User');

//const {createAuction,createBid} = require('../controllers/Auction');

//const verificationcodeSchema = require('../model/VerificationcodeSchema');

const router = express.Router();

router.post('/register',register);

router.post('/login',login);

router.post('/verify' , verify);

router.post('/buildIndiviualAccount',buildIndividualAccount);

router.post('/findorCreateCarrierRole' , findOrCreateCarrierRole);

router.post('/resetUserPasswordMobile',resetUserPasswordMobile);

router.post('/forgetPasswordMobile' , forgetPasswordMobile);

router.post('/forgetPassword' , forgetPassword)

router.post('/checkResetPasswordCode' , checkresetpasswordCode)

router.post('/resetUserPassword' , resetUserPassword)

router.post('/getUserById' , getUserById)

router.post('/editProfile' , editProfile)

//router.post('/createAuction',createAuction);

//router.post('/createBid',createBid);

// router.post('/buildBusinessAccount',buildBusinessAccount);

module.exports=router;
