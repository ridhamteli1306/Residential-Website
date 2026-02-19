const express = require('express');
const router = express.Router();
const { createVisit, getVisits, updateVisit } = require('../controllers/visitController');

router.post('/', createVisit);
router.get('/', getVisits);
router.patch('/:id', updateVisit);

module.exports = router;
