
const path = require('path')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add-product', path: '/admin/add-product' })
}
exports.postAddProduct = (req, res, next) => {
    const { title, price, description, imgUrl } = req.body;
    console.log('---------')
    console.log(req.user)
    req.user.createProduct({
        title: title,
        price: price,
        description: description,
        imgUrl: imgUrl,
    })
        .then((result) => {
            console.log(result)
        }).catch(err => console.log(err))

    res.redirect('/')
}


exports.getUpdateProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
        .then(product => {
            res.render('update-product', { props: product.dataValues, path: '/' }
            )
        })
        .catch(err => console.log(err))
}


exports.postUpdateProduct = (req, res, next) => {
    const { updateTitle, updatePrice, updateDescription, updateImgUrl } = req.body;
    const productId = req.params.productId
    Product.findByPk(productId)
        .then(product => {
            product.title = updateTitle;
            product.price = updatePrice;
            product.description = updateDescription;
            product.imgUrl = updateImgUrl;
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
    Product.findByPk(productId)
        .then(product => {
            return product.destroy()
        })
        .then(result => {
            res.redirect("/")
        })
        .catch(err => console.log(err))
}