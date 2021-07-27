class customErrorClass extends Error{
    constructor(message, statusCode){
        super(message),
        this.statusCode = statusCode
    }
}

const createCustomErrorInstance = (message, statusCode) =>{
    return new customErrorClass(message, statusCode)
}

module.exports = {customErrorClass, createCustomErrorInstance}