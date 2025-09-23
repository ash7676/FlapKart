const express =  require('express');

const router =  express.Router();

router.get("/view",authMiddleware, viewCart);
router.post('/placeOrder',authMiddleware,placeOrder)

module.exports =  router;