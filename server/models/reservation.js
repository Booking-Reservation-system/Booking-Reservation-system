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
    payment_method_types: {
        type: String,
        required: true,
    },
    invoice: {
        type: String,
    },
    paymentId: {
        type: String,
    }
}, {timestamps: true});

reservationSchema.pre('deleteOne', async function (next) {
    const Place = require('./place');
    const placeId = this.getQuery()["_id"];
    const place = await Place.findById(placeId);
    place.reservations.pull(this);
    await place.save();
    const User = require('./user');
    const user = await User.findById(this.userId);
    user.reservations.pull(this);
    await user.save();
    next();
})

module.exports = mongoose.model('Reservation', reservationSchema);