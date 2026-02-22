const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Incident = sequelize.define('Incident', {
    type: {
        type: DataTypes.ENUM('maintenance', 'security', 'noise', 'other'),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved'),
        defaultValue: 'open'
    },
    reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Incident;
