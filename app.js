const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./Database/connect')
const defaultErrorHandler = require('./Error handlers/defaultErrorHandler')
require('dotenv').config()

//Routers
const users = require('./Routers/users')
const cartRouter = require('./Routers/carts')

//Middlewares
app.use(cors())
app.use(express.json())

//Routes
app.use('/users', users)
app.use('/carts', cartRouter)

//Error handler middleware
app.use(defaultErrorHandler)

//All request handler
app.use('*', (req, res, next)=>{
    res.status(404).json({message: 'Not found'})
})



const port = process.env.PORT || 5000

const start = async() =>{
    try{
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log('Server started on '+port))
    }catch(err){
        console.log(err);
    }
}

start()