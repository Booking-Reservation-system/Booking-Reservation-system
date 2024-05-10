const express = require('express');
const {body} = require('express-validator');
const dashboardController = require('../controllers/dashboard');
const {isAuth, isAdmin} = require("../utils/isAuth");
const router = express.Router();

router.get('/dashboard/total-data', dashboardController.getTotalData);
router.get('/dashboard/line-chart', dashboardController.getLineChartDate);
router.get('/dashboard/check-role', isAuth, dashboardController.checkRole);

module.exports = router;