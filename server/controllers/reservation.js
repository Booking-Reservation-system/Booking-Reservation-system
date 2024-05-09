const Reservation = require("../models/reservation");
const Place = require("../models/place");
const {validationResult} = require("express-validator");
const ObjectId = require('mongodb').ObjectId;
const aes256 = require("../utils/aes-crypto");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment");
const User = require("../models/user");


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
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
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


exports.testPayment = async (req, res, next) => {
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
        const payment = new Payment({
            userId: req.userId,
            reservationId: reservation._id,
            paymentMethod: 'card',
            paymentStatus: 'success',
            paymentDate: new Date()
        });
        await payment.save();

        const customer = await stripe.customers.create({
            metadata: {
                userId: req.userId.toString(),
                reservationId: reservation._id.toString(),
                placeId: place._id.toString(),
            }
        });


        const link = process.env.CLIENT_URL + '/checkout_success?paymentId=' + aes256.encryptData(payment._id.toString());
        const cancel_link = process.env.CLIENT_URL + '?cancel=true&placeId=' + aes256.encryptData(placeId.toString());

        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: place.title,
                        images: [place.imageSrc],
                        description: place.description,
                        metadata: {
                            reservation_id: reservation._id.toString(),
                            place_id: place._id.toString(),
                            user_id: req.userId.toString(),
                        }
                    },
                    unit_amount: place.price * 100,
                },
                quantity: 1,
            },
        ];

        let result;

        try {
            result = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                phone_number_collection: {
                    enabled: true
                },
                line_items: line_items,
                mode: 'payment',
                customer: customer.id,
                success_url: link,
                cancel_url: cancel_link,
            });
            // add reservation id to user
            const user = await User.findById(req.userId);
            user.reservations.push(reservation._id);
            res.status(200).json({url: result.url});
        } catch (error) {
            console.log(error);
            await Reservation.findByIdAndDelete(reservation._id);
            await Payment.findByIdAndDelete(payment._id);
            place.reservations.pull(reservation._id);
            await place.save();
        }

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.cancelPayment = async (req, res, next) => {
    console.log(req.query.placeId);
    const placeId = new ObjectId(aes256.decryptData(req.query.placeId));
    try {
        const place = await Place.findById(placeId);
        if (!place) {
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        // find reservation
        const reservation = await Reservation.findById(place.reservations[place.reservations.length - 1]);
        const payment = await Payment.findOne({reservationId: reservation._id});
        // delete payment
        await Payment.findByIdAndDelete(payment._id);
        // delete reservation
        await Reservation.findByIdAndDelete(reservation._id);
        // delete place reservation
        place.reservations.pull(reservation._id);
        await place.save();

        res.redirect(process.env.CLIENT_URL);

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}