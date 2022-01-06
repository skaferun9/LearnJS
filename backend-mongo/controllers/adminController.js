const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const path = require('path')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add-product', path: '/admin/add-product' })
}
exports.postAddProduct = (req, res, next) => {
    const { title, price, description, imgUrl } = req.body;
    console.log("------- form post product --------")
    console.log(req.user)
    const product = new Product(title, price, description, imgUrl, null, req.user._id)
    product.save()
        .then((result) => {
            console.log(result)
        }).catch(err => console.log(err))

    res.redirect('/')
}


exports.getUpdateProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId)
    Product.findById(productId)
        .then(product => {
            res.render('update-product',
                {
                    props: product,
                    path: '/'
                }
            )
        })
        .catch(err => console.log(err))
}


exports.postUpdateProduct = (req, res, next) => {

    const { updateTitle, updatePrice, updateDescription, updateImgUrl } = req.body;
    const productId = req.params.productId
    Product.findById(productId)
        .then(productData => {
            const product = new Product(updateTitle, updatePrice, updateDescription, updateImgUrl, new ObjectId(productId))
            return product.save()
        })
        .then(result => {
            console.log('UPDATE COMPLETE!!!')
            res.redirect('/')
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.deleteById(productId)
        .then(result => {
            res.redirect("/")
        })
        .catch(err => console.log(err))
}