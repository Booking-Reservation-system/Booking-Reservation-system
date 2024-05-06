const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const refresh = require('passport-oauth2-refresh');
const axios = require('axios');
const ggPassport = require('../utils/ggConf');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if(!errors.isEmpty()){
            const error = new Error('Validated failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const hashPass = await bcrypt.hash(password, 12)
        const user = new User({
            email: email,
            hashedPassword: hashPass,
            name: name
        });
        const result = await user.save();
        res.status(201).json({
            message: 'User created.',
            userId: result._id
        });
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email})
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error
        }
        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isMatch) {
            const error = new Error('Wrong password.');
            error.statusCode = 401;
            throw error
        }
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        res.status(200).json({
            message: 'Logged in!',
            token: token,
            name: user.name,
        })
    } catch(err) {
            if(!err.statusCode) err.statusCode = 500
            next(err);
    }
}

//-------------------------------------------------------------------------------

exports.google = async (req, res, next) => {
    try {
        ggPassport.authenticate('google', {
            scope: ['profile', 'email'],
            accessType: 'offline',
            prompt: 'consent',
            // grantType: 'authorization_code',
            // approvalPrompt: 'force',
        })(req, res, next);
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }
}

exports.googleCallback = async (req, res, next) => {
    try {
        // use ggPassport.authenticate('google') to authenticate the user and console the error, req, res, next
        ggPassport.authenticate('google', (err, user, info, status) => {
            if(err){
                res.redirect('http://localhost:5173/?authError=true');
                return next(err);
            }
            if(!user){
                const error = new Error('User not authenticated.');
                error.statusCode = 401;
                return next(error);
            }
            req.login(user, { session: true }, async (err) => {
                if(err){
                    return next(err);
                }
                res.redirect('http://localhost:5173/?auth=true');
            });
        })(req, res, next);
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }

}

exports.googleSuccess = async (req, res, next) => {
    try {
        if(!req.user){
            const error = new Error('User not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        if(req.user.user.provider !== 'google'){
            const error = new Error('User not authenticated with google.');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            message: 'Google authentication successful.',
            accessToken: req.user.accessToken,
            expires_in: req.user.expires_in,
            token_type: req.user.token_type,
            refreshToken: req.user.refreshToken,
            name: req.user.user.name,
            image: req.user.user.image,
        });
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }
}

exports.googleRenew = async (req, res, next) => {
    try {
        const token = req.body.refreshToken;

        const refreshTokenDoc = await RefreshToken.findOne({ refreshToken: token });
        if (!refreshTokenDoc) {
            const error = new Error('Refresh token not found.');
            error.statusCode = 404;
            throw error;
        }

        const refreshToken = refreshTokenDoc.refreshToken;

        // Request a new access token
        refresh.requestNewAccessToken('google', refreshToken, function(err, accessToken, refreshToken1, params) {
            if (err) {
                const error = new Error('Failed to renew access token.');
                error.statusCode = 500;
                throw error;
            }

            if(req.user) req.logout();

            const user = {
                accessToken: accessToken,
                expires_in: params.expires_in,
                token_type: params.token_type,
                refreshToken: refreshToken,
            };

            req.login(user, { session: true }, async (err) => {
                if(err){
                    return next(err);
                }
            });

            res.status(200).json({
                message: 'Access token renewed.',
                accessToken: accessToken,
                expires_in: params.expires_in,
                token_type: params.token_type,
            });
        });
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }
}

exports.googleLogout = async (req, res, next) => {
    try {
        req.logout();
        const refreshTokenDoc = await RefreshToken.findOne({ userId: req.user._id });
        if (!refreshTokenDoc) {
            const error = new Error('Refresh token not found.');
            error.statusCode = 404;
            throw error;
        }

        await refreshTokenDoc.remove();

        res.status(200).json({
            message: 'Logged out.',
        });
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }

}