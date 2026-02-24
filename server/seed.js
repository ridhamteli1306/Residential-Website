const { sequelize, User, Unit, Visit, Incident, Booking } = require('./database');
const { faker } = require('@faker-js/faker');

async function seed() {
    try {
        await sequelize.sync({ force: true });

        const baseDate = new Date('2026-01-01T00:00:00Z');

        console.log('Building 367 Units (50 empty)...');
        const unitsToCreate = [];
        const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

        const emptyUnitIndexes = new Set();
        while (emptyUnitIndexes.size < 50) {
            emptyUnitIndexes.add(Math.floor(Math.random() * 367));
        }

        for (let i = 0; i < 367; i++) {
            const block = blocks[Math.floor(Math.random() * blocks.length)];
            const types = ['1b1b', '2b2b', 'townhouse', 'cabin'];
            const type = types[Math.floor(Math.random() * types.length)];

            let number;
            if (type === '1b1b' || type === '2b2b') {
                number = `${block}-${i + 100}`;
            } else {
                number = `${i + 400}`;
            }

            unitsToCreate.push({ number, type, block });
        }
        const insertedUnits = await Unit.bulkCreate(unitsToCreate, { returning: true });

        const occupiedUnits = insertedUnits.filter((_, i) => !emptyUnitIndexes.has(i));

        console.log('Building 1008 Highly Realistic Users...');
        const usersToCreate = [];

        usersToCreate.push({
            name: faker.person.fullName(),
            email: 'admin@terrazas.com',
            password: 'adminpassword',
            role: 'superadmin',
            phone: faker.phone.number({ style: 'national' }),
            unitId: null
        });

        for (let i = 1; i <= 5; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: `manager${i}@terrazas.com`,
                password: 'managerpassword',
                role: 'manager',
                phone: faker.phone.number({ style: 'national' }),
                unitId: null
            });
        }

        for (let i = 1; i <= 200; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: `watchman${i}@terrazas.com`,
                password: 'watchmanpassword',
                role: 'watchman',
                phone: faker.phone.number({ style: 'national' }),
                unitId: null
            });
        }

        for (let i = 1; i <= 2; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: `lifeguard${i}@terrazas.com`,
                password: 'lifeguardpassword',
                role: 'lifeguard',
                phone: faker.phone.number({ style: 'national' }),
                unitId: null
            });
        }

        // 800 Residents evenly distributed among occupiedUnits
        for (let i = 1; i <= 800; i++) {
            const assignedUnit = occupiedUnits[i % occupiedUnits.length];
            usersToCreate.push({
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: 'residentpassword',
                role: 'resident',
                phone: faker.phone.number({ style: 'national' }),
                unitId: assignedUnit.id
            });
        }

        const insertedUsers = await User.bulkCreate(usersToCreate, { returning: true });

        const residents = insertedUsers.filter(u => u.role === 'resident');
        const staff = insertedUsers.filter(u => ['superadmin', 'manager', 'watchman', 'lifeguard'].includes(u.role));

        // Group residents by unitId for easy lookup
        const unitToResidentsMap = {};
        residents.forEach(r => {
            if (!unitToResidentsMap[r.unitId]) {
                unitToResidentsMap[r.unitId] = [];
            }
            unitToResidentsMap[r.unitId].push(r);
        });

        console.log(`Building 2500 Gate Visits (>= Jan 2026)...`);
        const visitsToCreate = [];
        const visitStatuses = ['expected', 'entered', 'exited'];

        for (let i = 0; i < 2500; i++) {
            const destUnit = occupiedUnits[Math.floor(Math.random() * occupiedUnits.length)];
            const timeIn = faker.date.between({ from: baseDate, to: new Date() });

            // Random host from that unit
            const potentialHosts = unitToResidentsMap[destUnit.id];
            const hostId = potentialHosts && potentialHosts.length > 0
                ? potentialHosts[Math.floor(Math.random() * potentialHosts.length)].id
                : residents[0].id; // Fallback just in case

            visitsToCreate.push({
                visitorName: faker.person.fullName(),
                visitorIdCard: faker.string.alphanumeric({ length: { min: 6, max: 10 } }).toUpperCase(),
                plateNumber: Math.random() > 0.3 ? faker.vehicle.vrm() : null,
                status: visitStatuses[Math.floor(Math.random() * visitStatuses.length)],
                createdAt: timeIn,
                updatedAt: timeIn,
                exitTime: Math.random() > 0.5 ? faker.date.soon({ days: 1, refDate: timeIn }) : null,
                unitId: destUnit.id,
                hostId: hostId
            });
        }
        await Visit.bulkCreate(visitsToCreate);

        console.log('Building 500 Incident Reports (>= Jan 2026)...');
        const incidentsToCreate = [];
        const incidentTypes = ['maintenance', 'security', 'noise', 'other'];
        const incidentStatuses = ['open', 'in_progress', 'resolved'];
        const commonLocations = ['Main Gate', 'Pool Area', 'Hallway C', 'Parking Lot', 'Tennis Court'];

        for (let i = 0; i < 500; i++) {
            const isReportedByStaff = Math.random() > 0.8;
            const reporter = isReportedByStaff ?
                staff[Math.floor(Math.random() * staff.length)] :
                residents[Math.floor(Math.random() * residents.length)];
            const timeReported = faker.date.between({ from: baseDate, to: new Date() });

            incidentsToCreate.push({
                type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
                location: Math.random() > 0.4 ? commonLocations[Math.floor(Math.random() * commonLocations.length)] : faker.location.streetAddress(),
                description: faker.lorem.paragraph(),
                status: incidentStatuses[Math.floor(Math.random() * incidentStatuses.length)],
                createdAt: timeReported,
                updatedAt: timeReported,
                reporterId: reporter.id
            });
        }
        await Incident.bulkCreate(incidentsToCreate);

        console.log('Building 1200 Amenity Bookings (>= Jan 2026)...');
        const bookingsToCreate = [];
        const amenities = ['community_center', 'resort_pool', 'tennis_court', 'multi_purpose_facility', 'nature_trails', 'landscaping'];
        const bookingStatuses = ['pending', 'confirmed', 'cancelled'];

        for (let i = 0; i < 1200; i++) {
            const resident = residents[Math.floor(Math.random() * residents.length)];
            const selectedAmenity = amenities[Math.floor(Math.random() * amenities.length)];

            // Generate a date >= Jan 1, 2026 and up to a month into the future
            const bookingDate = faker.date.between({ from: baseDate, to: faker.date.soon({ days: 30 }) });

            // Format time nicely (e.g. 14:00)
            const hour = faker.number.int({ min: 8, max: 20 }); // Bookings between 8am and 8pm
            const timeString = `${hour.toString().padStart(2, '0')}:00`;

            bookingsToCreate.push({
                amenity: selectedAmenity,
                facilitySport: selectedAmenity === 'multi_purpose_facility' ? faker.helpers.arrayElement(['Basketball', 'Volleyball', 'Soccer']) : null,
                guests: faker.number.int({ min: 1, max: 8 }),
                date: bookingDate,
                time: timeString,
                status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
                userId: resident.id
            });
        }
        await Booking.bulkCreate(bookingsToCreate);

        console.log('==============================================');
        console.log('DATABASE SUCCESSFULLY SEEDED WITH FAKER DATA!');
        console.log('Total Users: 1,008');
        console.log('Total Units: 367 (50 Available)');
        console.log('Total Visits: 2,500');
        console.log('Total Incidents: 500');
        console.log('Total Bookings: 1,200');
        console.log('Dates Validated: All constraints >= Jan 1, 2026');
        console.log('==============================================');

        process.exit(0);
    } catch (err) {
        console.error('Failed to seed database:', err);
        process.exit(1);
    }
}

seed();
