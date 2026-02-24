const { Unit, User } = require('../database');

const getUnits = async (req, res) => {
    try {
        const units = await Unit.findAll({
            include: [{ model: User, as: 'residents', attributes: ['id', 'name', 'email'] }]
        });
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching units', error: error.message });
    }
};

const getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id, {
            include: [{ model: User, as: 'residents', attributes: ['id', 'name', 'email'] }]
        });
        if (!unit) return res.status(404).json({ message: 'Unit not found' });
        res.json(unit);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching unit', error: error.message });
    }
};

const toggleUnitStatus = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id, {
            include: [{ model: User, as: 'residents' }]
        });
        if (!unit) return res.status(404).json({ message: 'Unit not found' });

        const isOccupied = unit.residents && unit.residents.length > 0;

        if (isOccupied) {
            // Mark as available: un-assign all residents from this unit
            await User.update({ unitId: null }, { where: { unitId: unit.id } });
        }

        // Return updated unit
        const updatedUnit = await Unit.findByPk(req.params.id, {
            include: [{ model: User, as: 'residents', attributes: ['id', 'name', 'email'] }]
        });
        res.json(updatedUnit);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling unit status', error: error.message });
    }
};

module.exports = { getUnits, getUnitById, toggleUnitStatus };
