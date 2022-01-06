const express = require('express');
const path = require('path')
const shopRouter = require('./Router/shop');
const adminRouter = require('./Router/admin');
const errorController = require('./controllers/errorController')
const mongoConnect = require('./util/database').mongoConnect;
const ObjectId = require('mongodb').ObjectId;
const User = require('./models/user');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, "public")))
app.set('view engine', 'ejs');
app.set('views', 'views')


app.use((req, res, next) => {
  User.findById('614737ebc1d48053a04aba8b')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)

      next()
    })
    .catch(err => console.log(err))
})

app.use(shopRouter);
app.use('/admin', adminRouter.router);

app.use(errorController.get404)


mongoConnect(() => {
  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000`)
  });
})




