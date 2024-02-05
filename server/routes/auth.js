const express = require('express');
const { body } = require('express-validator');

const authController = require('../controller/auth');
const User = require('../models/user');

const router = express.Router();

// /controller/auth/signup => POST
router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                return User.findOne({email:value})
                            .then(doc => {
                                if(doc) return Promise.reject('Email address already exists.');
                            })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 8})
            .withMessage('Password must be at least 8 characters long.'),
        body('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name cannot be empty.')
    ],
    authController.signup
);

// /controller/auth/login => POST
router.post('/login', authController.login);

module.exports = router;