const express = require('express');
const router = express.Router();
const { getUnits, getUnitById } = require('../controllers/unitController');

router.get('/', getUnits);
router.get('/:id', getUnitById);

module.exports = router;
