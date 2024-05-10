const express = require('express');
const {body} = require('express-validator');

const reservationController = require('../controllers/reservation');
const {isAuth} = require('../utils/isAuth');
const aes256 = require("../utils/aes-crypto");
const Reservation = require("../models/reservation");
const Place = require("../models/place");
const User = require("../models/user");

const router = express.Router();

// Get all reservations
// /api/v1/reservation => GET
router.get('/reservations', isAuth, reservationController.getReservations);

// Get a reservation by ID
// /api/v1/reservation/:reservationId => GET
router.get('/reservation/:reservationId', isAuth, reservationController.getReservation);

// Create a new reservation
// /api/v1/reservation/=> POST
router.post(
    '/reservation/new',
    isAuth,
    [
        // check fields: placeId, startDate, endDate, totalPrice
        body('placeId')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Place ID cannot be empty.'),
        body('startDate')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Start date cannot be empty.'),
        body('endDate')
            .trim()
            .not()
            .isEmpty()
            .withMessage('End date cannot be empty.'),
        body('totalPrice')
            .isNumeric()
            .withMessage('Total price must be a number.'),
    ],
    reservationController.createReservation
);

// Delete a reservation by ID
// /api/v1/reservation/:reservationId => DELETE
router.delete('/reservation/:reservationId', isAuth, reservationController.deleteReservation);

// Pay for a reservation
// /api/v1/reservation/payments => POST
router.post(
    '/reservation/payments',
    isAuth,
    [
        body('placeId')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Place ID cannot be empty.'),
        body('stripeId')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Stripe ID cannot be empty.'),
        body('paymentMethod')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Payment method cannot be empty.'),
        body('paymentStatus')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Payment status cannot be empty.'),
        body('paymentDate')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Payment date cannot be empty.'),
    ],
    reservationController.payments
);

// Test payment
// /api/v1/reservation/test-payment => POST
router.post('/reservation/test-payment', isAuth,
    [
        // check fields: placeId, startDate, endDate, totalPrice
        body('placeId')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Place ID cannot be empty.'),
        body('startDate')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Start date cannot be empty.'),
        body('endDate')
            .trim()
            .not()
            .isEmpty()
            .withMessage('End date cannot be empty.'),
        body('totalPrice')
            .isNumeric()
            .withMessage('Total price must be a number.'),
        body('totalDays')
            .isNumeric()
            .withMessage('Total days must be a number.'),
    ],
    reservationController.testPayment);

router.delete('/reservation/cancel_payment/:reservationId', isAuth, reservationController.cancelPayment);

module.exports = router;