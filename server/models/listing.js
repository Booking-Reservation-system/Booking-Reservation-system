const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    roomCount: {
        type: Number,
        required: true,
    },
    bathroomCount: {
        type: Number,
        required: true,
    },
    guestCapacity: {
        type: Number,
        required: true,
    },
    locationValue: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    reservations: [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true,
    }]
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);