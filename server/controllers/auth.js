const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const refresh = require('passport-oauth2-refresh');

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

exports.googleSuccess = async (req, res, next) => {
    try {
        if(!req.user){
            const error = new Error('User not authenticated.');
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
        if(!req.user){
            const error = new Error('User not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        const refreshTokenDoc = await RefreshToken.findOne({ userId: req.user._id });
        if (!refreshTokenDoc) {
            const error = new Error('Refresh token not found.');
            error.statusCode = 404;
            throw error;
        }
        if(refreshTokenDoc.expires_at < new Date()){
            const error = new Error('Refresh token expired.');
            error.statusCode = 401;
            throw error;
        }

        const refreshToken = refreshTokenDoc.refreshToken;

        // Request a new access token
        refresh.requestNewAccessToken('google', refreshToken, function(err, accessToken, refreshToken, params) {
            if (err) {
                const error = new Error('Failed to renew access token.');
                error.statusCode = 500;
                throw error;
            }
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

exports.githubSuccess = async (req, res, next) => {
    try {
        if(!req.user){
            const error = new Error('User not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            message: 'Facebook authentication successful.',
            accessToken: req.user.accessToken,
            refreshToken: req.user.refreshToken,
            name: req.user.user.name,
            image: req.user.user.image,
        });
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }
}

exports.githubRenew = async (req, res, next) => {
    try {
        if(!req.user){
            const error = new Error('User not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        const refreshTokenDoc = await RefreshToken.findOne({ userId: req.user._id });
        if (!refreshTokenDoc) {
            const error = new Error('Refresh token not found.');
            error.statusCode = 404;
            throw error;
        }
        if(refreshTokenDoc.expires_at < new Date()){
            const error = new Error('Refresh token expired.');
            error.statusCode = 401;
            throw error;
        }

        const refreshToken = refreshTokenDoc.refreshToken;

        // Request a new access token
        refresh.requestNewAccessToken('facebook', refreshToken, function(err, accessToken, refreshToken, params) {
            if (err) {
                const error = new Error('Failed to renew access token.');
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({
                message: 'Access token renewed.',
                accessToken: accessToken,
            });
        });
    } catch(err) {
        if(!err.statusCode) err.statusCode = 500
        next(err);
    }
}