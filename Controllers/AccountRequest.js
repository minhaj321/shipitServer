
const AccountRequest = require('../Model/AccountRequest');

const IndividualAccount = require('../Model/IndividualAccount');

const User = require ('../Model/User');

const {sendMail} = require ('../Utils/nodemailer');

exports.approveAccountRequest = async (req,res) =>{
  try {
    const {accountId} = req.body;

    const response = await IndividualAccount.findByIdAndUpdate({_id:accountId},{$set:{carrierRole:true}},{new:true});

    if(response!=null){

      const responseAccount = await AccountRequest.findOneAndDelete({accountId:accountId})

      try {
        const accountResponse = await IndividualAccount.findOne({_id:responseAccount.accountId})

        try {
          const userResponse = await User.findOne({_id:accountResponse.userId});

          let mail = {
            to: userResponse.email,
            from: `${process.env.GMAIL_USER}`,
            text: `Your Account Request has been accepted`

        }

        let resMail = await sendMail(mail)

        res.json({
            status: 200,
            message: resMail
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
    }else{
      res.json({
        status:400,
        message:'Not found'
      })
    }

  } catch (error) {
      res.json({
          status:403,
          message:error.message
      })
  }
    
}

exports.rejectAccountRequest = async (req,res) =>{
  try {
    const {accountId} = req.body;


      const responseAccount = await AccountRequest.findOneAndDelete({accountId:accountId})

      try {
        const accountResponse = await IndividualAccount.findOne({_id:responseAccount.accountId})

        try {
          const userResponse = await User.findOne({_id:accountResponse.userId})

          let mail = {
            to: userResponse.email,
            from: `${process.env.GMAIL_USER}`,
            text: `Your account Request has been rejected`

        }

        let resMail = await sendMail(mail)

        res.json({
            status: 200,
            message: resMail
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
          status:403,
          message:error.message
      })
  }
    
}

exports.getAllAccountRequests=async(req,res)=>{

  try{
    const response = await AccountRequest.find();
    res.json({
      status:200,
      message:response
    })

  }catch(err){
    res.json({
      status:400,
      message:err.message
    })
  }

}
    
exports.getAccountRequestById=async(req,res)=>{
  
  const {requestId} = req.body;

  try{
    const response = await AccountRequest.findById({_id:requestId})
    if(response){
      res.json({
        status:200,
        message:response
      })
    }
    else{
      res.json({
        status:200,
        message:'Request not found'
      })
      
    }

  }catch(err){
    res.json({
      status:400,
      message:err.message
    })
  }


}