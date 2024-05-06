const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let authHeader = req.get('Authorization');
    console.log(req.user);
    if(!authHeader){
        const error = new Error('Not authenticated, header not found.');
        error.statusCode = 401;
        throw error;
    }
    authHeader = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated, token not found.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}