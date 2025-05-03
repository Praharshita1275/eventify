const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get all bookings
router.get('/', bookingController.getBookings);
// Get bookings by user (email)
router.get('/user/:user', bookingController.getBookingsByUser);
// Get bookings by resource
router.get('/resource/:resourceId', bookingController.getBookingsByResource);
// Create a booking
router.post('/', bookingController.createBooking);
// Cancel (delete) a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router; 