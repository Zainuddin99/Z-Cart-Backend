const { addUsers, signInUsers } = require('../Controllers/users')

const routers = require('express').Router()

routers.post('/signup', addUsers)
routers.post('/signin', signInUsers)

module.exports = routers