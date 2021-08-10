const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports.tokenVerifier = (req, res, next) =>{
    const token = req.headers.authorization
    try {
        const user = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
        req.userId = user
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({message: 'Authorization failed'})
    }
}