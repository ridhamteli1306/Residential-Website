const { Booking, User } = require('../database');

const createBooking = async (req, res) => {
    const { amenity, facilitySport, guests, date, time, userId } = req.body;
    try {
        const booking = await Booking.create({
            amenity,
            facilitySport,
            guests,
            date,
            time,
            userId
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['name', 'email', 'role'] }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

const getBookingsByUser = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.params.userId },
            order: [['date', 'DESC'], ['time', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

module.exports = { createBooking, getBookings, getBookingsByUser, updateBookingStatus };
