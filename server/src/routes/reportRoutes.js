const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');

router.get('/monthly', ctrl.generateMonthly);

module.exports = router;
