const { Incident, User } = require('../database');

const createIncident = async (req, res) => {
    const { type, location, description, reporterId } = req.body;
    try {
        const incident = await Incident.create({
            type,
            location,
            description,
            reporterId
        });
        res.status(201).json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Error reporting incident', error: error.message });
    }
};

const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.findAll({
            include: [
                { model: User, as: 'reporter', attributes: ['name', 'email'] }
            ]
        });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching incidents', error: error.message });
    }
};

const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const incident = await Incident.findByPk(id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });

        incident.status = status;
        await incident.save();

        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Error updating incident', error: error.message });
    }
};

module.exports = { createIncident, getIncidents, updateIncidentStatus };
