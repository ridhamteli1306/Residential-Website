const sequelize = require('./db');
const User = require('./models/User');
const Unit = require('./models/Unit');
const Visit = require('./models/Visit');
const Incident = require('./models/Incident');
const Booking = require('./models/Booking');

// Associations
Unit.hasMany(User, { foreignKey: 'unitId', as: 'residents' });
User.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

Unit.hasMany(Visit, { foreignKey: 'unitId' });
Visit.belongsTo(Unit, { foreignKey: 'unitId' });

User.hasMany(Visit, { foreignKey: 'hostId', as: 'hostedVisits' }); // Resident hosting the visitor
Visit.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

User.hasMany(Incident, { foreignKey: 'reporterId', as: 'reportedIncidents' });
Incident.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Unit, Visit, Incident, Booking };
