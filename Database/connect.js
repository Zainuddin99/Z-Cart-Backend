const mongoose = require('mongoose')

const connectDB = async(url) =>{
    return mongoose.connect(url, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser:true,
        useFindAndModify: false
    })
}

module.exports = connectDB