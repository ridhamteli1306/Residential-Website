const express = require('express');
const router = express.Router();
const { createIncident, getIncidents, updateIncidentStatus } = require('../controllers/incidentController');

router.post('/', createIncident);
router.get('/', getIncidents);
router.put('/:id', updateIncidentStatus);

module.exports = router;
