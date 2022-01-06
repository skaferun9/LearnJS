const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer')
const port = 5600;

const feedRoute = require('./routes/feed');
const AuthRoute = require('./routes/auth');

app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getHours() + '-' + new Date().getMinutes()
            + '-' + new Date().getSeconds() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);

    } else {
        cb(null, false);
    }
}
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))



app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/feed', feedRoute)
app.use('/auth', AuthRoute)

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data })
})

mongoose
    .connect(
        'mongodb+srv://xxxx:xxxxx@cluster0.dhuzp.mongodb.net/xxxxxx?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(port, () => {
            console.log("Server is run at port " + port)
        })
    })
    .catch(err => console.log(err))


