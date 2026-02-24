const express = require('express');
const router = express.Router();
const { getUnits, getUnitById, toggleUnitStatus } = require('../controllers/unitController');

router.get('/', getUnits);
router.get('/:id', getUnitById);
router.patch('/:id/status', toggleUnitStatus);

module.exports = router;
