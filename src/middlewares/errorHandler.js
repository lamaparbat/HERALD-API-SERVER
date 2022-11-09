const { StatusCodes } = require('http-status-codes')
const multer = require('multer')

/**
 * this error handling middleware will throw error accoring to the error name
 * we handle invalid token and expired token in the handler
 * if both the error were bypassed we send a 'bad request!' error message
 */
const {PAYLOAD_MISSING_LOG} = require('../constants/index').ERROR_CONSTANT
const errorHandler = (err, req, res, next) => {
    if(err.message === PAYLOAD_MISSING_LOG){
        return res.status(StatusCodes.BAD_REQUEST).send({
            error: "Some fields are missing. Please provide all the fields !!"
        })
    }
    
    if (err.name === "JsonWebTokenError") {
        res.status(StatusCodes.FORBIDDEN).send({ error: 'invalid token' })
    } else if (err.name === 'TokenExpiredError') {
        res.status(StatusCodes.FORBIDDEN).send({ error: 'session timemout' })
    } else if (err instanceof multer.MulterError){
        res.status(StatusCodes.BAD_GATEWAY).send({ error : err.field})
    } else {
       res.status(StatusCodes.BAD_REQUEST).send({ error: 'server error!' })
    }
    //this next function will let us see the error in console without crashing our server
    next(err)
}

module.exports = errorHandler