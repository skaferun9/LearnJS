const { read } = require('fs')
const path = require('path')
const Product = require('../models/product')

exports.getMainShop = (req, res, next) => {
    Product.fetchAll()
        .then(product => {
            res.render('main',
                {
                    props: product,
                    pageTitle: 'Main',
                    path: '/'
                })
        })
        .catch(err => console.log(err))
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            console.log(product)
            res.render('productDetail',
                {
                    props: product,
                    pageTitle: 'Main',
                    path: '/'
                })
        })
        .catch((err) => {
            console.log(err)
        })

}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            // console.log(cart)
            res.render('myCart',
                {
                    props: cart,
                    pageTitle: 'Main',
                    path: '/'
                })

        })
        .catch(err => console.log(err))
}

exports.addCart = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(err => console.log(err))
}

exports.getMyOrder = (req, res, next) => {
    req.user.getOrder()
        .then(order => {
            console.log("---------")
            console.log(order)
            console.log("---------")
            res.render('myOrder',
                {
                    props: order,
                    pageTitle: 'myOrder',
                    path: '/'
                })
        }
        )
        .catch(err => console.log(err))
}

exports.deleteCartItem = (req, res, next) => {
    const productId = req.params.productId;
    req.user.deletePdFromCart(productId)
    res.redirect('/cart')
}

exports.createOrder = (req, res, next) => {
    req.user.addOrder()
        .then(() => {
            console.log("create order complete!!")
            res.redirect("/cart")
        }).catch(err => console.log(err))
}