const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const ggPassport = require('../utils/ggConf');
const gitPassport = require('../utils/gitConf');
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
router.get('/google', ggPassport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    // prompt: 'consent',
    // grantType: 'authorization_code',
    // approvalPrompt: 'force',
}));

// GOOGLE AUTH SUCCESS
// /api/v1/auth/google/success => GET
router.get('/google/success', authController.googleSuccess);

// GOOGLE AUTH CALLBACK
// /api/v1/auth/google/callback => GET
router.get('/google/callback', ggPassport.authenticate('google', {
    successRedirect: 'http://localhost:5173/',
    failureRedirect: 'http://localhost:5173/',
    session: true,
}));

// GOOGLE AUTH REFRESH TOKEN
// /api/v1/auth/google/refresh => POST
router.post('/google/refresh', authController.googleRenew);

//--------------------------------------------------------------------------------------------

// GITHUB AUTH
// /api/v1/auth/github => GET
router.get('/github', gitPassport.authenticate('github', {
    accessType: 'offline',
    // prompt: 'consent',
    approvalPrompt: 'force',
}));

// GITHUB AUTH CALLBACK
// /api/v1/auth/github/callback => GET
router.get('/github/callback', gitPassport.authenticate('github', {
    successRedirect: 'http://localhost:5173/',
    failureRedirect: 'http://localhost:5173/',
    session: true,
}));

// GITHUB AUTH SUCCESS
// /api/v1/auth/github/success => GET
router.get('/github/success', authController.githubSuccess);

// GITHUB AUTH REFRESH TOKEN
// /api/v1/auth/github/refresh => POST
router.post('/github/refresh', authController.githubRenew);

module.exports = router;