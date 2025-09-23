const express =  require('express');
const { addToCart, removeItem, updateItemQty, viewCart, checkoutCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router =  express.Router();

router.post("/addToCart",authMiddleware, addToCart);
router.post("/removeItem",authMiddleware, removeItem);
router.post("/updateQty",authMiddleware, updateItemQty);
router.get("/view",authMiddleware, viewCart);
router.post('/checkout',authMiddleware,checkoutCart)

module.exports =  router;