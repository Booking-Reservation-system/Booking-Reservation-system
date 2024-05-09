const User = require("../models/user");
const Place = require("../models/place");
const Payment = require("../models/payment");
const Reservation = require("../models/reservation");
const {validationResult} = require('express-validator');

exports.getTotalData = async (req, res, next) => {
    try {
        const totalCustomer = await User.countDocuments();
        const totalReservation = await Reservation.countDocuments();
        const totalPaymentData = await Reservation.find().exec();

        let totalPayment = 0;
        totalPaymentData.forEach((payment) => {
            const startDate = new Date(payment.startDate);
            const endDate = new Date(payment.endDate);
            totalPayment += (((endDate - startDate) / (3600 * 1000 * 24)) + 1) * payment.totalPrice;
        })
        res.status(200).json({
            message: "Fetched total data successfully.",
            totalCustomer: totalCustomer,
            totalReservation: totalReservation,
            totalPayment: totalPayment,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getLineChartDate = async(req, res, next) => {
    try {
        const places = await Place.aggregate([
            { $group: {
                _id: "$category",
                count: { $sum: 1 }
            }}
        ]).exec();
       
        const placeData = places.map((place) => ({
            x: place._id,
            y: place.count
        }));

        res.status(200).json([{
            // message: "Fetched line chart data successfully.",
            id: "places",
            color: "hsla(233, 100%, 68%, 1)",
            data: placeData
        }]);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


