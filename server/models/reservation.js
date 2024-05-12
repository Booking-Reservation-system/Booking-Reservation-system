const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    placeId: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPayed: {
        type: Boolean,
        default: false,
    },
    invoice: {
        type: String,
    },
    paymentId: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model('Reservation', reservationSchema);