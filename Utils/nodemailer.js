const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});


const smtpTransport = nodemailer.createTransport( {
    service:'Gmail',
    auth:{
        user:`${process.env.GMAIL_USER}`,
        pass:`${process.env.GMAIL_PASSWORD}`
    }
})

exports.sendMail = async (mail) =>{

    try {
        let response = await smtpTransport.sendMail(mail)
        return response
    } catch (error) {
        return error
    }
   
}
