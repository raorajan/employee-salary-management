const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/attendanceController');

router.get('/', ctrl.list);
router.post('/mark', ctrl.mark);

module.exports = router;
