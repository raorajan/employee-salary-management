const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;
