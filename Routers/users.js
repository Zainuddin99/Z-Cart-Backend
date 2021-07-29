const { addUsers, signInUsers, verifyLoggedUser } = require('../Controllers/users')

const routers = require('express').Router()

routers.post('/signup', addUsers)
routers.post('/signin', signInUsers)
routers.post('/verify', verifyLoggedUser)

module.exports = routers