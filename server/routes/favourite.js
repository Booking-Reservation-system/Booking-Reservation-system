const express = require('express');
const { body } = require('express-validator');

const favouriteController = require('../controllers/favourite');
const isAuth = require('../utils/isAuth');

const router = express.Router();

// Get all favorites
// /api/v1/favorite => GET
router.get('/favorite', isAuth, favouriteController.getFavorites);

// Add a favorite
// /api/v1/favorite => POST
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
    favouriteController.newFavoriteId
);

// Delete a favorite by ID
// /api/v1/favorite/:favoriteId => DELETE
router.delete('/favorite/:favoriteId', isAuth, favouriteController.deleteFavoriteId);

module.exports = router;