const express = require('express');
const user = require('../models/user');
const { body } = require('express-validator/check')
const router = express.Router();

const authController = require('../controller/authController')

router.post('/singup', [
    body('email').isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return user.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-mail already exists.')
                    }
                })
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty()

], authController.signup);

router.post('/login', [body('email').isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
body('password').trim().isLength({ min: 5 }),], authController.login);

module.exports = router;