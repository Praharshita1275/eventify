const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  bookedBy: {
    type: String, // user email or userId
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema); 