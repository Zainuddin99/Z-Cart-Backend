const { createCustomErrorInstance } = require("../Error handlers/customErrorHandler")
const Users = require('../Database/Models/all-users')
const { asyncWrapper } = require("../Error handlers/asyncWrapper")
require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendMail } = require("../nodemailer")

const addUsers = asyncWrapper(async(req, res, next) =>{
    
    const {firstName, lastName, eMail, password, confirmPassword} = req.body

    if(!firstName || !lastName || !eMail || !password || !confirmPassword){
        return next(createCustomErrorInstance('All fields are required!', 400))
    }

    if(password !== confirmPassword){
        return next(createCustomErrorInstance('Password don\'t match', 422))
    }

    const isExistingUser = await Users.findOne({eMail})
    
    if(isExistingUser){
        return next(createCustomErrorInstance('User with this email already exists', 400))
    }

    bcrypt.hash(password, 12, async(err, result)=>{
        if(err){
            return next()
        }
        const user = await Users.create({firstName, lastName, eMail, password: result})

        sendMail(`${firstName} ${lastName}`, eMail )
        .then((result)=>{
            if(result){

            res.status(201).json({message: 'User created and mail sent to you'})

            }else{
                res.status(201).json({message: 'User created but we could not send mail to you!'})
            }
        })
    })

})


const signInUsers = asyncWrapper(async(req, res, next)=>{
    const {eMail, password, googleSign} = req.body

    if(googleSign){
        const {email:eMail, givenName:firstName, familyName:lastName} = googleSign
        const alreadyAdded = await Users.findOne({eMail})
        if(!alreadyAdded){
            await Users.create({eMail, firstName, lastName})
        }
    }
    
    const user = await Users.findOne({eMail: eMail || googleSign.email})

    if(user){
        if(!googleSign){
        bcrypt.compare(password, user.password, (err, result)=>{
            if(err){
                return next(createCustomErrorInstance('Try with google sign in for this email', 400))
            }
            if(!result){
                return next(createCustomErrorInstance('Invalid password', 401))
            }
            const token = jwt.sign({
                    eMail: user.eMail,
                    fullName: user.firstName+' '+user.lastName,
                    id:user._id
                }, process.env.SECRET_KEY)
                return res.status(201).json({message: "Logged in successfully", userToken: token})
        })
    }else{
        const token = jwt.sign({
                    eMail: user.eMail,
                    fullName: user.firstName+' '+user.lastName,
                    id:user._id
                }, process.env.SECRET_KEY)
                return res.status(201).json({message: "Logged in successfully", userToken: token})
            }
    }else{
    next(createCustomErrorInstance('No user found', 404))
    }
})

const verifyLoggedUser = (req, res) =>{
    const {token} = req.body
    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        res.status(200).json(decode)
    }catch(err){
        createCustomErrorInstance('Session expired', 403)
    }
}

module.exports = {addUsers, signInUsers, verifyLoggedUser}
