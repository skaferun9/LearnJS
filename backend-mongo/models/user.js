const getDb = require('../util/database').getDb;
const mongodb = require('mongodb')

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    save() {
        const db = getDb();
        db.collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.item.map(i => {
            return i.productId
        })
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(product => {
                return product.map(p => {
                    return {
                        ...p, quantity: this.cart.item.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                })
            })
            .then(cart => {
                return cart
            })
            .catch(err => {
                console.log(err)
            })
    }

    deletePdFromCart(productId) {
        const db = getDb();
        const removeProduct = this.cart.item.filter(product => {
            return product.productId.toString() === productId.toString()
        })
        const newPdQuantity = removeProduct.map(pd => {
            return pd.quantity - 1
        })
        if (newPdQuantity > 0) {
            const newCart = this.cart.item.map(i => {
                if (i.productId.toString() === productId.toString()) {
                    i.quantity = newPdQuantity[0]
                } return i
            })
            return db.collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { item: newCart } } }
            )

        } else {
            const newCart = this.cart.item.filter(product => {
                return product.productId.toString() != productId.toString()
            })
            return db.collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { item: newCart } } })
        }
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(product => {
                const order = {
                    product: product,
                    orderBy: {
                        userId: new mongodb.ObjectId(this._id),
                        username: this.username
                    }
                }
                return db.collection("orders")
                    .insertOne(order)
                    .then(
                        db.collection('users').updateOne(
                            { _id: new mongodb.ObjectId(this._id) },
                            { $set: { cart: { item: [] } } })

                    )
                    .catch(err => console.log(err))

            })
            .catch(err => console.log(err))


    }

    getOrder() {


        const db = getDb();
        return db.collection("orders")
            .find({ 'orderBy.userId': this._id })
            .toArray()


    }

    addToCart(product) {
        const cartProductIndex = this.cart.item.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        })
        console.log(cartProductIndex)
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.item]
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.item[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            })
        }

        const updatedCart = {
            item: updatedCartItems
        }
        const db = getDb();
        db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        )
    }

    static findById(UserId) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectId(UserId) })
            .then(user => {
                console.log(user)
                return user
            })
            .catch(err => console.log(err))
    }
}

module.exports = User;