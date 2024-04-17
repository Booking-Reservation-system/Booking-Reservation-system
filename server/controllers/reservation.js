const aes256 = require("../utils/aes-crypto");
const Reservation = require("../models/reservation");
const Place = require("../models/place");
const {validationResult} = require("express-validator");
const ObjectId = require('mongodb').ObjectId;


exports.getReservations = async (req, res, next) => {
    const {placeId} = req.params;
    let query = {};
    query.userId = req.userId;
    if (placeId) query.placeId = aes256.decryptData(placeId);
    try {
        const reservations = await Reservation.find(query, null, {sort: {createdAt: -1}}).populate('placeId');
        // encrypt all id
        reservations.forEach(reservation => {
            reservation._id = aes256.encryptData(reservation._id.toString());
            reservation.userId = aes256.encryptData(reservation.userId.toString());
            reservation.placeId = aes256.encryptData(reservation.placeId.toString());
        });
        res.status(200).json({
            message: 'Fetched reservations successfully.',
            reservations: reservations
        });
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getReservation = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    const reservationId = aes256.decryptData(req.params.reservationId);
    try {
        const place = await Place.findById(placeId).populate('reservations');
        if(!place){
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
        res.status(200).json({ message: 'Place fetched.', reservation: reservation });
    }
    catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.createReservation = async (req, res, next) => {
    const err = validationResult(req);
    try {
        if(!err.isEmpty()){
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
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.deleteReservation = async (req, res, next) => {
    const reservationId = aes256.decryptData(req.params.reservationId);
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
        await Reservation.findByIdAndRemove(reservationId);
        res.status(200).json({message: 'Deleted reservation.'});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}