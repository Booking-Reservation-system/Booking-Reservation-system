const express = require('express');
const { body } = require('express-validator');

const ownerController = require('../controllers/owner');
const isAuth = require('../utils/isAuth');

const router = express.Router();

// /api/owner/place => POST
router.post(
    '/place',
    isAuth,
    [
        // check fields: title, description, category, roomCount, bathroomCount, guestCount, location, price
        body('title')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Title cannot be empty.'),
        body('description')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Description cannot be empty.'),
        body('category')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Category cannot be empty.'),
        body('roomCount')
            .isNumeric()
            .withMessage('Room count must be a number.'),
        body('bathroomCount')
            .isNumeric()
            .withMessage('Bathroom count must be a number.'),
        body('guestCount')
            .isNumeric()
            .withMessage('Guest count must be a number.'),
        body('location')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Location cannot be empty.'),
        body('price')
            .isNumeric()
            .withMessage('Price must be a number.'),
    ],
    ownerController.createPlace
);

module.exports = router;