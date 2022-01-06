const fs = require('fs')
const path = require('path')
const Product = require('../models/product')
const Order = require('../models/order')

exports.getMainShop = (req, res, next) => {

    console.log(req.session.user)
    Product.find()
        .then(product => {
            res.render('main',
                {
                    props: product,
                    pageTitle: 'Main',
                    isLoggedIn: req.session.isLoggedIn,
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
                    isLoggedIn: req.session.isLoggedIn,
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

    req.user
        .populate('cart.item.productId')
        .then(user => {
            console.log(user.cart.item)
            products = user.cart.item
            res.render('myCart',
                {

                    isLoggedIn: req.session.isLoggedIn,
                    props: products,
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

    Order
        .find({ 'orderBy.userId': req.user._id })
        .then(order => {
            res.render('myOrder',
                {
                    isLoggedIn: req.session.isLoggedIn,
                    props: order,
                    pageTitle: 'myOrder',
                    path: '/'
                })
        })
        .catch(err => console.log(err))
}

exports.deleteCartItem = (req, res, next) => {

    const productId = req.params.productId;
    req.user.deletePdFromCart(productId)
    res.redirect('/cart')
}

exports.createOrder = (req, res, next) => {

    req.user.populate('cart.item.productId')
        .then(user => {
            const order = new Order({
                orderBy: {
                    userId: user._id,
                    email: user.email
                },
                item: user.cart.item
            })
            req.user.clearCart()
            return order.save()
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))




}

exports.getMyProduct = (req, res, next) => {
    console.log(req.user._id)
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('myProduct', {
                props: products,
                pageTitle: "My Product"
            })
        })
        .catch(err => console.log(err))
}


exports.getOrderInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoicePath = path.join('data', 'invoice', invoiceName)
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                console.log('no this order')
                return res.redirect('/')
            }
            if (order.orderBy.userId.toString() != req.user._id.toString()) {
                console.log('not your order')
                return res.redirect('/')
            }
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return err;
            //     }
            //     res.setHeader('Content-Type', 'application/pdf')
            //     res.setHeader('Content-Disposition', "attachment; filename='" + invoiceName + '"')
            //     return res.send(data);
            // })
            const file = fs.createReadStream(invoicePath);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            )
            file.pipe(res)
        })
        .catch(err => console.log(err))

}