const express = require('express');
const {body} = require('express-validator');
const {isAuth} = require('../utils/isAuth');

const profileController = require('../controllers/profile');

const router = express.Router();

router.get('/profile',
    isAuth,
    profileController.getProfile);

router.put('/profile',
    isAuth,
    profileController.updateProfile);

router.put('/profile/change-password',
    isAuth,
    profileController.changePassword);

module.exports = router;
