const { createCustomErrorInstance } = require("../Error handlers/customErrorHandler")
const Users = require('../Database/Models/all-users')
const { asyncWrapper } = require("../Error handlers/asyncWrapper")

const bcrypt = require('bcrypt')

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
                return res.status(201).json({message: "Logged in successfully"})
            }
            return next(createCustomErrorInstance('Invalid password', 401))
        })
    }else{
    next(createCustomErrorInstance('No user found', 404))
    }
})

module.exports = {addUsers, signInUsers}
