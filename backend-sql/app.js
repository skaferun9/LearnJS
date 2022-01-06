const express = require('express');
const path = require('path')
const shopRouter = require('./Router/shop');
const adminRouter = require('./Router/admin');
const errorController = require('./controllers/errorController')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order')
const OrderItem = require('./models/orderItem')
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, "public")))
app.set('view engine', 'ejs');
app.set('views', 'views')




app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use(shopRouter);
app.use('/admin', adminRouter.router);



Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem });


app.use(errorController.get404)
sequelize.sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'test', email: 'test@gmail.com' })
    }
    return user
  })
  .then(user => {
    user.getCart()
      .then(cart => {
        if (!cart) {
          user.createCart();
        }
        return user
      })
      .catch(err => console.log(err))

  })
  .then(user => {
    console.log(user)
    app.listen(4000, () => {
      console.log(`🚀 Server ready at http://localhost:4000`)
    });
  })
  .catch(err => {
    console.log(err)
  })



