const { customErrorClass } = require("./customErrorHandler")

const defaultErrorHandler = (err, req, res, next) => {
    if(err instanceof customErrorClass){
        return res.status(err.statusCode).json({message: err.message})
    }
    res.status(500).json({message: 'Something went wrong'})
} 

module.exports = defaultErrorHandler