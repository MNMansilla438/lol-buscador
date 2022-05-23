const createError = require('http-errors');

module.exports.Response = {
    success: (res, sendStatus = 200, message= "Ok", body = {}) => {
        res.status(sendStatus).json({message, body});
    },
    error: (res, error = null) => {
        const {statusCode, message} = error 
        ? error : new createError.InternalServerError();
        res.status(statusCode).json({message})
    }
}