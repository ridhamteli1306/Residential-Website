const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../db');

const Visit = sequelize.define('Visit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    visitorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visitorIdCard: {
        type: DataTypes.STRING,
        allowNull: false // DL or ID
    },
    plateNumber: {
        type: DataTypes.STRING
    },
    entryTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    exitTime: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM('active', 'completed'),
        defaultValue: 'active'
    }
});

module.exports = Visit;
