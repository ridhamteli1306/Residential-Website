const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Booking = sequelize.define('Booking', {
    amenity: {
        type: DataTypes.ENUM('community_center', 'resort_pool', 'tennis_court', 'multi_purpose_facility', 'nature_trails', 'landscaping'),
        allowNull: false
    },
    facilitySport: {
        type: DataTypes.STRING, // e.g., 'Basketball' for multi_purpose_facility
        allowNull: true
    },
    guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    date: {
        type: DataTypes.DATEONLY, // Just YYYY-MM-DD
        allowNull: false
    },
    time: {
        type: DataTypes.STRING, // e.g., '14:00'
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'confirmed'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Booking;
