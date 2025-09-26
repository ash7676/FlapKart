
const placeOrder =  function(req,res,next){
    try{
        //user adds items to his/her cart
        //user places order for items
        //if order placed successfully, empty the cart
        //if order failed,
        
    }catch(err){
        next(err)
    }
}


//NEED AN ORDER REVIEW API TO SHOW TOTAL PRICE, QUANTITY, TAX ,OTHER CHARGES
const viewOrder =  function(req,res,next){
    try{

    }catch(err){
        next(err)
    }
}

module.exports ={
    placeOrder,
    viewOrder
}