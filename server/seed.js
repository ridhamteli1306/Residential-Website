const { sequelize, User, Unit } = require('./database');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Reset database

        // Create Superadmin
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@terrazas.com',
            password: 'adminpassword', // In production, hash this!
            role: 'superadmin'
        });

        // Create a Manager
        const manager = await User.create({
            name: 'Manager John',
            email: 'manager@terrazas.com',
            password: 'managerpassword',
            role: 'manager'
        });

        // Create a Resident
        const resident = await User.create({
            name: 'Resident Alice',
            email: 'alice@terrazas.com',
            password: 'residentpassword',
            role: 'resident'
        });

        // Create Units
        await Unit.bulkCreate([
            { number: 'A-101', type: 'studio', block: 'A', ownerId: resident.id },
            { number: 'B-205', type: 'townhouse', block: 'B' },
            { number: 'C-302', type: 'cabin', block: 'C' }
        ]);

        // Create a Security Guard (Watchman)
        const watchman = await User.create({
            name: 'Security Officer Bob',
            email: 'security@terrazas.com',
            password: 'securitypassword',
            role: 'watchman'
        });

        console.log('Database seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to seed database:', err);
        process.exit(1);
    }
}

seed();
