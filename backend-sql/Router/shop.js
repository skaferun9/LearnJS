const path = require('path')
const express = require('express');
const router = express.Router()
const shopController = require('../controllers/shopController')
router.get('/', shopController.getMainShop)

router.get('/product/:productId', shopController.getProductById)

router.get('/cart', shopController.getCart)

router.post('/cart/:productId', shopController.addCart)

router.post('/delete-cart/:productId', shopController.deleteCartItem)

router.post('/create-order', shopController.createOrder)

router.get('/order', shopController.getMyOrder)

module.exports = router;