const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) =>{

    let error = {...err}

    error.message = err.message;
    //log to console for dev
   console.log(err)

   //mongoose bad objectId
   
   if(err.name === 'CastError') {
       const message =`bootcamp with id ${err.value} not found`
       error = new ErrorResponse(message, 404)
   }
  //mongoose bad code

   if(err.code === 11000){
      const message =   'duplicate field value enter'
     error = new ErrorResponse(message, 404)
   }

   //mongoose validation errorHandler
    if(err.code === 'name'){
        const message = object.values(err.errors).map(val=>val.message);
        error = new ErrorRessponse(message, 404)
    }

   res.status(error.statusCode || 500).json({
       success:false,
       error: error.message || `Server error`
   });
}

module.exports= errorHandler;