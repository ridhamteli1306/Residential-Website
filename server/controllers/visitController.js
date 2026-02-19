const { Visit, Unit, User } = require('../database');

const createVisit = async (req, res) => {
    const { visitorName, visitorIdCard, plateNumber, unitId, hostId } = req.body;
    try {
        const visit = await Visit.create({
            visitorName,
            visitorIdCard,
            plateNumber,
            unitId,
            hostId
        });
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: 'Error creating visit', error: error.message });
    }
};

const getVisits = async (req, res) => {
    try {
        const visits = await Visit.findAll({
            include: [
                { model: Unit, attributes: ['number'] },
                { model: User, as: 'host', attributes: ['name'] }
            ]
        });
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching visits', error: error.message });
    }
};

const updateVisit = async (req, res) => {
    const { id } = req.params;
    const { status, exitTime } = req.body;
    try {
        const visit = await Visit.findByPk(id);
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        visit.status = status || visit.status;
        visit.exitTime = exitTime || visit.exitTime;
        await visit.save();

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: 'Error updating visit', error: error.message });
    }
};

module.exports = { createVisit, getVisits, updateVisit };
