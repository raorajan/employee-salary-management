const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/salaryController');

router.get('/', ctrl.list);
router.post('/process', ctrl.processPayroll);

module.exports = router;
