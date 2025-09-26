const express =  require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { viewOrder, placeOrder } = require('../controllers/orderController');

const router =  express.Router();

router.get("/view",authMiddleware, viewOrder);
router.post('/placeOrder',authMiddleware,placeOrder)

module.exports =  router;