const express = require('express');
const { body } = require('express-validator');

const favouriteController = require('../controllers/favourite');
const isAuth = require('../utils/isAuth');

const router = express.Router();

// Get all favorites
// /api/v1/favorite => GET
router.get('/favourite', isAuth, favouriteController.getFavourites);

// Add a favourite
// /api/v1/favourite => POST
router.post(
    '/favourite',
    isAuth,
    [
        // check fields: placeId
        body('placeId')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Place ID cannot be empty.'),
    ],
    favouriteController.newFavouriteId
);

// Delete a favourite by ID
// /api/v1/favourite/:favouriteId => DELETE
router.delete('/favourite/:favouriteId', isAuth, favouriteController.deleteFavouriteId);

module.exports = router;