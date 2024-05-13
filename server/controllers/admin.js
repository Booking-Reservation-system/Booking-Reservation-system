const User = require("../models/user");
const Place = require("../models/place");
const Reservation = require("../models/reservation");
const {validationResult} = require('express-validator');
const aes256 = require('../utils/aes-crypto');

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

exports.getLineChartData = async (req, res, next) => {
    try {
        const places = await Place.aggregate([
            {
                $group: {
                    _id: "$locationValue",
                    count: {$sum: 1}
                }
            }
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

exports.checkRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        res.status(200).json({
            message: 'Role fetched.',
            role: user.role
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500
        next(err);
    }
}

exports.getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find().populate({
            path: 'userId',
            select: 'email name'
        }).populate({
            path: 'placeId',
            select: 'category location title price imageSrc'
        }).select('placeId startDate endDate totalPrice')
            .exec();
        if (reservations.length === 0) {
            const error = new Error('No reservation found.');
            error.statusCode = 404;
            throw error;
        }
        const encodedData = reservations.map((reservation) => {
            return {
                ...reservation,
                _id: aes256.encryptData(reservation._id.toString()),
                placeReservationParams: aes256.encryptData(reservation._id.toString())
            }
        });
        console.log(encodedData);
        res.status(200).json({
            message: 'Fetched all reservations successfully.',
            reservations: encodedData
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

