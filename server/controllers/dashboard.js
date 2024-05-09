const User = require("../models/user");
const Place = require("../models/place");
const Payment = require("../models/payment");
const Reservation = require("../models/reservation");
const {validationResult} = require('express-validator');

exports.getTotalData = async (req, res, next) => {
    try {
        const totalCustomer = await User.countDocuments();
        const totalReservation = await Reservation.countDocuments();
        
        res.status(200).json({
            message: "Fetched total data successfully.",
            totalCustomer: totalCustomer,
            totalReservation: totalReservation
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}


