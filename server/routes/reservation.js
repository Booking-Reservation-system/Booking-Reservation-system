const express = require('express');
const { body } = require('express-validator');

const reservationController = require('../controllers/reservation');
const isAuth = require('../utils/isAuth');

const router = express.Router();

// Get all reservations
// /api/v1/reservation => GET
router.get('/reservation', isAuth, reservationController.getReservations);

// Get a reservation by ID
// /api/v1/reservation/:reservationId => GET
router.get('/reservation/:reservationId', isAuth, reservationController.getReservation);

// Create a new reservation
// /api/v1/reservation/=> POST
router.post(
    '/reservation',
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

module.exports = router;