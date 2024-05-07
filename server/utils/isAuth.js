const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refresh-token');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    let authHeader = req.get('Authorization');
    console.log(req.user);
    if (!authHeader && !req.user) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    if (req.user) {
        const refreshToken = await RefreshToken.findOne({refreshToken: req.user.refreshToken});
        if (!refreshToken) {
            const error = new Error('Refresh token not found.');
            error.statusCode = 404;
            throw error;
        }
        const user = await User.findById(refreshToken.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        req.userId = user._id;
        return next();
    }
    authHeader = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated, token not found.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}