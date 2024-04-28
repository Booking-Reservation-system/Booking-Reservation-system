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
    favouritePlaces: [{
            type: Schema.Types.ObjectId,
            ref: 'Place',
            required: true,
    }],
    accounts: [{
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
    }],
    places: [{
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