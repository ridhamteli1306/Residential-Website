const { Unit, User } = require('../database');

const getUnits = async (req, res) => {
    try {
        const units = await Unit.findAll({
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
        });
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching units', error: error.message });
    }
};

const getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id, {
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
        });
        if (!unit) return res.status(404).json({ message: 'Unit not found' });
        res.json(unit);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching unit', error: error.message });
    }
};

module.exports = { getUnits, getUnitById };
