const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../db');

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('1b1b', '2b2b', 'townhouse', 'cabin'),
        allowNull: false
    },
    block: {
        type: DataTypes.STRING // e.g., "Block A"
    }
});

module.exports = Unit;
