const path = require('path')
const Product = require('../models/product')

const Cart = require('../models/cart')

exports.getMainShop = (req, res, next) => {
    Product.findAll()
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

    Product.findByPk(productId)
        .then(product => {
            console.log(product.dataValues)
            res.render('productDetail', { props: product.dataValues, pageTitle: 'Main', path: '/' })
        })
        .catch((err) => {
            console.log(err)
        })

}

exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(product => {
                    res.render('myCart',
                        {
                            props: product,
                            pageTitle: 'myCart',
                            path: '/'
                        })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

exports.addCart = (req, res, next) => {
    const productId = req.params.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity
                newQuantity = oldQuantity + 1
                return product
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            })
        })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
}

exports.deleteCartItem = (req, res, next) => {
    const productId = req.params.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });

        })
        .then(products => {
            const product = products[0]
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect("/cart")
        })
        .catch(err => console.log(err))
}

exports.createOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProduct(products.map(product => {
                        console.log(product)
                        product.orderItem = { quantity: product.cartItem.quantity }
                        return product
                    }))
                })
                .catch(err => console.log(err))
        })
        .then(result => {
            return fetchedCart.setProducts(null)
        })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
}


exports.getMyOrder = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            console.log('------------------------')
            console.log(orders)
            res.render('myOrder',
                {
                    props: orders,
                    pageTitle: 'myOrder',
                    path: '/'
                })
        })
        .catch(err => console.log(err))
}