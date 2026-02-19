const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'manager', 'watchman', 'resident', 'visitor'),
        defaultValue: 'resident'
    },
    phone: {
        type: DataTypes.STRING
    },
    profileImage: {
        type: DataTypes.STRING
    }
});

module.exports = User;
