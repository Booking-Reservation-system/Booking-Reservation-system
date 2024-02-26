const express = require('express');
const { body } = require('express-validator');

const ownerController = require('../controllers/owner');
const isAuth = require('../utils/isAuth');
const aes256 = require('../utils/aes-crypto');

const router = express.Router();

router.get('/test', (req, res, next) => {
        const aesEcrypted = aes256.encryptData('123456');
    res.status(200).json({ message: 'Owner route works.', data: {aesEcrypted} });
});

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

// /api/owner/place => GET
router.get('/place', ownerController.getPlaces);

// /api/owner/place/:placeId => GET
router.get('/place/:placeId', ownerController.getPlace);

// /api/owner/place/:placeId => PUT
router.put(
    '/place/:placeId',
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
    ownerController.updatePlace
);

// /api/owner/place/:placeId => DELETE
router.delete('/place/:placeId', isAuth, ownerController.deletePlace);

// /api/owner/reservation => GET
router.get('/reservation', isAuth, ownerController.getReservations);

// /api/owner/reservation/:reservationId => GET
router.get('/reservation/:reservationId', isAuth, ownerController.getReservation);

// /api/owner/reservation/=> POST
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
    ownerController.createReservation
);

// /api/owner/reservation/:reservationId => DELETE
router.delete('/reservation/:reservationId', isAuth, ownerController.deleteReservation);

// /api/owner/favorite => GET
router.get('/favorite', isAuth, ownerController.getFavorites);

// /api/owner/favorite => POST
router.post(
    '/favorite',
    isAuth,
    [
        // check fields: placeId
        body('placeId')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Place ID cannot be empty.'),
    ],
    ownerController.newFavoriteId
);

// /api/owner/favorite/:favoriteId => DELETE
router.delete('/favorite/:favoriteId', isAuth, ownerController.deleteFavoriteId);

module.exports = router;