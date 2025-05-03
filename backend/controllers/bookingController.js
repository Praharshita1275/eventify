const Booking = require('../models/Booking');

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings by user (by email)
exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ bookedBy: req.params.user });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for a resource
exports.getBookingsByResource = async (req, res) => {
  try {
    const bookings = await Booking.find({ resourceId: req.params.resourceId });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Cancel (delete) a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 