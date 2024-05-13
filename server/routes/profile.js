const express = require('express');
const {body} = require('express-validator');

const profileController = require('../controllers/profile');

const router = express.Router();

router.get('/profile', profileController.getProfile);

module.exports = router;
