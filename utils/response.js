function successResponse(res,message,data={}){
    return res.status(200).json({
        success:true,
        message,
        data,
        error: null
    })
}

function errorResponse(res,message,error={},statusCode=400){
    return res.status(statusCode).json({
        success:false,
        message,
        data:null,
        error
    })
}

module.exports  = {successResponse,errorResponse}