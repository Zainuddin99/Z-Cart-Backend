const { createCustomErrorInstance } = require("../Error handlers/customErrorHandler")
const Users = require('../Database/Models/all-users')
const { asyncWrapper } = require("../Error handlers/asyncWrapper")
require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addUsers = asyncWrapper(async(req, res, next) =>{
    const {firstName, lastName, eMail, password, confirmPassword} = req.body

    if(password !== confirmPassword){
        return next(createCustomErrorInstance('Password don\'t match', 422))
    }

    const isExistingUser = await Users.findOne({eMail})
    
    if(isExistingUser){
        return next(createCustomErrorInstance('User with this email already exists', 401))
    }

    bcrypt.hash(password, 12, async(err, result)=>{
        if(err){
            return next()
        }
        const user = await Users.create({firstName, lastName, eMail, password: result})
        res.status(201).json({message: 'User created'})
    })

})


const signInUsers = asyncWrapper(async(req, res, next)=>{
    const {eMail, password} = req.body

    const user = await Users.findOne({eMail})

    if(user){
        bcrypt.compare(password, user.password, (err, result)=>{
            if(err){
                return next()
            }
            if(result){
                const token = jwt.sign({
                    eMail: user.eMail,
                    fullName: user.firstName+' '+user.lastName,
                    id:user._id
                }, process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                })
                return res.status(201).json({message: "Logged in successfully", userToken: token})
            }
            return next(createCustomErrorInstance('Invalid password', 401))
        })
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
