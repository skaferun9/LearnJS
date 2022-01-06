const express = require('express');
const router = express.Router();
const path = require('path')
const adminController = require('../controllers/adminController')

router.get("/add-product", adminController.getAddProduct)

router.post('/add-product', adminController.postAddProduct)

router.get('/update-product/:productId', adminController.getUpdateProduct)

router.post('/update-product/:productId', adminController.postUpdateProduct)

router.post('/delete-product/:productId', adminController.postDeleteProduct)



exports.router = router;
