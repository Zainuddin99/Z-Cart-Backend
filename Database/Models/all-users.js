const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    productId: {type: String, required: true},
    name: { type: String, required: true},
    image: {type: String, required: true},
    cart: {type: Number, default:1},
    price: {type: Number, required: true}
})

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    eMail: {type: String, required: true},
    password: {type: String, default: null},
    carts: [ cartSchema ]
})

module.exports = mongoose.model('Users', userSchema)