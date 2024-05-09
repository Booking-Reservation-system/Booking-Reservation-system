const express = require('express');
const { body } = require('express-validator');
const dashboardController = require('../controllers/dashboard');
const isAuth = require('../utils/isAuth');
const router = express.Router();

router.get('/dashboard/total-data', isAuth, dashboardController.getTotalData);

module.exports = router;