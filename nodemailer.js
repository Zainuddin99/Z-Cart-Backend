const nodemailer = require('nodemailer')
const {google} = require('googleapis')
require('dotenv').config
const {CLIENT_SECRET, CLIENT_ID, REDIRECT_URI, REFRESH_TOKEN, MAIL_SENDER} = process.env

const Oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
Oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

module.exports.sendMail = async(fullName, eMail) =>{
    try{

    const accessToken = await Oauth2Client.getAccessToken()

    //nodemailer transport function
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: MAIL_SENDER,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    })

    //setting mailOptions for transport
    const mailOptions = {
        from: `Zainuddin <${MAIL_SENDER}>`,
        to: eMail,
        subject: "Welcome to Z-Cart",
        html: `<h1>
                    Dear ${fullName},
                </h1>
                <p>
                    You have successfully registered to our online shopping system with email <b>${eMail}</b>
                </p>
                <h5>Thanks and regards from Z-Cart family</h5>`
        }

    //finally sendMail
    const result = await transport.sendMail(mailOptions)
    return true

    }catch(err){
        
        return false

    }
    
}