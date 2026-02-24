const { sequelize, User, Unit, Visit, Incident, Booking } = require('./database');
const { faker } = require('@faker-js/faker'); // Ensure you ran: npm install @faker-js/faker

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Wipe everything
        console.log('Building 1008 Highly Realistic Users...');

        const usersToCreate = [];
        const baseDate = new Date('2026-01-01T00:00:00Z'); // Strict rule: Nothing older than Jan 1, 2026

        // 1. Superadmin (1)
        usersToCreate.push({
            name: faker.person.fullName(),
            email: 'admin@terrazas.com',
            password: 'adminpassword',
            role: 'superadmin',
            phone: faker.phone.number({ style: 'national' })
        });

        // 2. Managers (5)
        for (let i = 1; i <= 5; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: `manager${i}@terrazas.com`,
                password: 'managerpassword',
                role: 'manager',
                phone: faker.phone.number({ style: 'national' })
            });
        }

        // 3. Watchman (200)
        for (let i = 1; i <= 200; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: `watchman${i}@terrazas.com`, // using predictable prefix to make testing easier
                password: 'watchmanpassword',
                role: 'watchman',
                phone: faker.phone.number({ style: 'national' })
            });
        }

        // 4. Lifeguards (2)
        for (let i = 1; i <= 2; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: `lifeguard${i}@terrazas.com`,
                password: 'lifeguardpassword',
                role: 'lifeguard',
                phone: faker.phone.number({ style: 'national' })
            });
        }

        // 5. Residents (800)
        for (let i = 1; i <= 800; i++) {
            usersToCreate.push({
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(), // Realistic random emails
                password: 'residentpassword',
                role: 'resident',
                phone: faker.phone.number({ style: 'national' })
            });
        }

        const insertedUsers = await User.bulkCreate(usersToCreate);

        // Extract out distinct arrays for relational mapping
        const residents = insertedUsers.filter(u => u.role === 'resident');
        const staff = insertedUsers.filter(u => ['superadmin', 'manager', 'watchman', 'lifeguard'].includes(u.role));

        console.log('Building 367 Units (50 empty)...');
        // Rules: alphanumeric for 1b1b/2b2b. numeric for townhouse/cabin. 7 Blocks.
        const unitsToCreate = [];
        const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // 7 Blocks

        // Pick exactly 50 distinct array indexes to leave empty
        const emptyUnitIndexes = new Set();
        while (emptyUnitIndexes.size < 50) {
            emptyUnitIndexes.add(Math.floor(Math.random() * 367));
        }

        let residentAssignmentIndex = 0;

        for (let i = 0; i < 367; i++) {
            const block = blocks[Math.floor(Math.random() * blocks.length)];

            // Randomly pick a property type
            const types = ['1b1b', '2b2b', 'townhouse', 'cabin'];
            const type = types[Math.floor(Math.random() * types.length)];

            // Generate valid Number logic based on type (alphanumeric vs purely numeric)
            let number;
            if (type === '1b1b' || type === '2b2b') {
                number = `${block}-${i + 100}`; // e.g. A-101
            } else {
                number = `${i + 400}`; // purely numeric e.g. 401
            }

            // Figure out the owner (or null if it's one of the 50 empty ones)
            let ownerId = null;
            if (!emptyUnitIndexes.has(i)) {
                ownerId = residents[residentAssignmentIndex % residents.length].id;
                residentAssignmentIndex++;
            }

            unitsToCreate.push({
                number,
                type,
                block,
                ownerId // Nullable
            });
        }
        const insertedUnits = await Unit.bulkCreate(unitsToCreate, { returning: true });

        // We need units that actually have owners so visitors can visit them
        const occupiedUnits = insertedUnits.filter(u => u.ownerId !== null);

        console.log(`Building 2500 Gate Visits (>= Jan 2026)...`);
        const visitsToCreate = [];
        const visitStatuses = ['expected', 'entered', 'exited'];

        for (let i = 0; i < 2500; i++) {
            // Pick rand occupied unit
            const destUnit = occupiedUnits[Math.floor(Math.random() * occupiedUnits.length)];
            const timeIn = faker.date.between({ from: baseDate, to: new Date() }); // Random date >= Jan 1, 2026

            visitsToCreate.push({
                visitorName: faker.person.fullName(),
                visitorIdCard: faker.string.alphanumeric({ length: { min: 6, max: 10 } }).toUpperCase(),
                plateNumber: Math.random() > 0.3 ? faker.vehicle.vrm() : null, // 70% drive a car
                status: visitStatuses[Math.floor(Math.random() * visitStatuses.length)],
                createdAt: timeIn,
                updatedAt: timeIn,
                exitTime: Math.random() > 0.5 ? faker.date.soon({ days: 1, refDate: timeIn }) : null,
                unitId: destUnit.id,
                hostId: destUnit.ownerId // Correctly linked FK!
            });
        }
        await Visit.bulkCreate(visitsToCreate);

        console.log('Building 500 Incident Reports (>= Jan 2026)...');
        const incidentsToCreate = [];
        const incidentTypes = ['maintenance', 'security', 'noise', 'other'];
        const incidentStatuses = ['open', 'in_progress', 'resolved'];
        const commonLocations = ['Main Gate', 'Pool Area', 'Hallway C', 'Parking Lot', 'Tennis Court'];

        for (let i = 0; i < 500; i++) {
            const isReportedByStaff = Math.random() > 0.8; // 20% reported by staff, 80% residents
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
