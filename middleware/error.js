const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err,req,res,next) => {
    let error = { ...err };
    error.message = err.message;
    // log to develppero
    console.log(err);

    // Mongo bad objectID
    if(err.name === 'CastError') {

        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message,404);
    }

    //Momgose duplicate key
    if( err.code === 11000){
        const message = 'Duplicate fileds value entered';
        error = new ErrorResponse(message, 400);
    }

    //Moongose validation error
    if(err.name ==='ValidatorError') {
        const message = Object.values(err.erros).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
    
};

module.exports = errorHandler;