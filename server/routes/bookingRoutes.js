const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingsByUser, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getBookings); // Get all (for managers/admins)
router.get('/user/:userId', getBookingsByUser); // Get specific user's bookings
router.put('/:id', updateBookingStatus); // Confirm/Cancel

module.exports = router;
