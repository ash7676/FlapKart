const express =  require('express');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createProduct, getProduct, listProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const router =  express.Router();

router.post("/add",authMiddleware,createProduct);
router.get('/getOne',authMiddleware,getProduct);
router.get('/list',authMiddleware,listProducts);
router.post('/update',authMiddleware,updateProduct);
router.post('/delete',authMiddleware,deleteProduct)
module.exports =  router;