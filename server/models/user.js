const mongoose = require('mongoose');
const {models} = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: { // unique
        type: String,
    },
    emailVerified: {
        type: Date,
    },
    image: {
        type: String,
    },
    hashedPassword: {
        type: String,
    },
    favoriteIds: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
    }],
    accounts: [{
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
    }],
    listings: [{
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
    }],
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true,
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);