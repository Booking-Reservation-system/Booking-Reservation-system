const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

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
                userId: user._id.toString()
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