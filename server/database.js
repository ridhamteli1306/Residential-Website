const sequelize = require('./db');
const User = require('./models/User');
const Unit = require('./models/Unit');
const Visit = require('./models/Visit');
const Incident = require('./models/Incident');

// Associations
User.hasMany(Unit, { foreignKey: 'ownerId' });
Unit.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

Unit.hasMany(Visit, { foreignKey: 'unitId' });
Visit.belongsTo(Unit, { foreignKey: 'unitId' });

User.hasMany(Visit, { foreignKey: 'hostId', as: 'hostedVisits' }); // Resident hosting the visitor
Visit.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

User.hasMany(Incident, { foreignKey: 'reporterId', as: 'reportedIncidents' });
Incident.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

module.exports = { sequelize, User, Unit, Visit, Incident };
