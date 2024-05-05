const mongoose = require('mongoose');
const {models} = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
    },
    favouritePlaces: [{
            type: Schema.Types.ObjectId,
            ref: 'Place',
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