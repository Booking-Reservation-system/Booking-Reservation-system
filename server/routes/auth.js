const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const ggPassport = require('../utils/ggConf');
require('../utils/gitConf');
const User = require('../models/user');

const router = express.Router();

// SIGNUP
// /api/v1/auth/signup => POST
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

// LOGIN
// /api/v1/auth/login => POST
router.post('/login', authController.login);

//--------------------------------------------------------------------------------------------

// GOOGLE AUTH
// /api/v1/auth/google => GET
router.get('/google', authController.google);

// GOOGLE AUTH SUCCESS
// /api/v1/auth/google/success => GET
router.get('/google/success', authController.googleSuccess);

// GOOGLE AUTH CALLBACK
// /api/v1/auth/google/callback => GET
router.get('/google/callback', authController.googleCallback);

// GOOGLE AUTH REFRESH TOKEN
// /api/v1/auth/google/refresh => POST
router.post('/google/refresh', authController.googleRenew);

// GOOGLE AUTH LOGOUT
// /api/v1/auth/google/logout => GET
router.get('/google/logout', authController.googleLogout);

//--------------------------------------------------------------------------------------------

// GITHUB AUTH
// /api/v1/auth/github => GET
router.get('/github', authController.github);

// GITHUB AUTH CALLBACK
// /api/v1/auth/github/callback => GET
router.get('/github/callback', authController.githubCallback);

// GITHUB AUTH SUCCESS
// /api/v1/auth/github/success => GET
router.get('/github/success', authController.githubSuccess);

// GITHUB AUTH REFRESH TOKEN
// /api/v1/auth/github/refresh => POST
router.post('/github/refresh', authController.githubRenew);

// GITHUB AUTH LOGOUT
// /api/v1/auth/github/logout => GET
router.get('/github/logout', authController.githubLogout);

module.exports = router;