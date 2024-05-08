const Reservation = require("../models/reservation");
const Place = require("../models/place");
const {validationResult} = require("express-validator");
const ObjectId = require('mongodb').ObjectId;
const aes256 = require("../utils/aes-crypto");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment");


exports.getReservations = async (req, res, next) => {
    const {placeId} = req.params;
    let query = {};
    query.userId = req.userId;
    if (placeId) query.placeId = aes256.decryptData(placeId);
    try {
        const reservations = await Reservation.find(query, null, {sort: {createdAt: -1}}).populate('placeId');
        // encrypt all id
        const encryptReservation = reservations.map(reservation => {
            return {
                ...reservation,
                _id: aes256.encryptData(reservation._id.toString()),
                userId: aes256.encryptData(reservation.userId.toString()),
                placeReservationParams: aes256.encryptData(reservation.placeId._id.toString())
            }
        });

        res.status(200).json({
            message: 'Fetched reservations successfully.',
            reservations: encryptReservation,

        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getReservation = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    const reservationId = aes256.decryptData(req.params.reservationId);
    try {
        const place = await Place.findById(placeId).populate('reservations');
        if (!place) {
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        let reservation = place.reservations.filter(reservation => reservation._id.toString() === reservationId);
        // encrypt all id
        reservation = reservation.map(reservation => {
            reservation._id = aes256.encryptData(reservation._id.toString());
            reservation.userId = aes256.encryptData(reservation.userId.toString());
            reservation.placeId = aes256.encryptData(reservation.placeId.toString());
            return reservation;
        });
        res.status(200).json({message: 'Place fetched.', reservation: reservation});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.createReservation = async (req, res, next) => {
    const err = validationResult(req);
    try {
        if (!err.isEmpty()) {
            const errs = new Error('Validation failed, entered data is incorrect!');
            errs.statusCode = 422;
            errs.data = err.array();
            throw errs;
        }

        const placeId = new ObjectId(aes256.decryptData(req.body.placeId));
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const totalPrice = req.body.totalPrice;
        const place = await Place.findById(placeId);
        if (!place) {
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        const reservation = new Reservation({
            userId: req.userId,
            placeId: placeId,
            startDate: startDate,
            endDate: endDate,
            totalPrice: totalPrice
        });
        await reservation.save();
        place.reservations.push(reservation);
        await place.save();
        // encrypt all id
        reservation._id = aes256.encryptData(reservation._id.toString());
        reservation.userId = aes256.encryptData(reservation.userId.toString());
        reservation.placeId = aes256.encryptData(reservation.placeId.toString());
        res.status(201).json({message: 'Reservation created.', reservation: reservation});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.deleteReservation = async (req, res, next) => {
    const reservationId = aes256.decryptData(req.params.reservationId);
    // remove encripted id
    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            const error = new Error('Could not find reservation.');
            error.statusCode = 404;
            throw error;
        }
        const place = await Place.findById(reservation.placeId);
        place.reservations.pull(reservationId);
        await place.save();
        await Reservation.findByIdAndDelete(reservationId);
        res.status(200).json({message: 'Deleted reservation.'});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.payments = async (req, res, next) => {
    const reservationId = aes256.decryptData(req.body.reservationId);
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            const errs = new Error('Validation failed, entered data is incorrect!');
            errs.statusCode = 422;
            errs.data = err.array();
            throw errs;
        }
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            const error = new Error('Could not find reservation.');
            error.statusCode = 404;
            throw error;
        }
        const stripeId = req.body.striprId;
        const paymentMethod = req.body.paymentMethod;
        const paymentStatus = req.body.paymentStatus;
        const paymentDate = req.body.paymentDate;

        const payment = new Payment({
            userId: req.userId,
            reservationId: reservationId,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            paymentDate: paymentDate
        });
        const response = await payment.save();
        if (!response) {
            const error = new Error('Payment failed.');
            error.statusCode = 500;
            throw error;
        }

        const paymentId = aes256.encryptData(response._id.toString());

        const paymentIntent = await stripe.paymentIntents.create({
            amount: reservation.totalPrice * 100,
            currency: 'usd',
            payment_method: stripeId,
            confirm: true,
            error_on_requires_action: true,
            automatic_payment_methods: {
                // payment_method_types: ['card'],
                enabled: true,
                allow_redirects: "never"
            },
            return_url: process.env.CLIENT_URL + '/payment/success?paymentId=' + paymentId,
        });
        if (paymentIntent.status !== 'succeeded') {
            const error = new Error('Payment failed.');
            error.statusCode = 500;
            throw error;
        }

        res.status(201).json({message: 'Payment created.', payment: payment});
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}