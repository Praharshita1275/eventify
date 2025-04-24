const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Event title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time']
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location']
  },
  category: {
    type: String,
    required: [true, 'Please provide an event category'],
    enum: ['conference', 'workshop', 'seminar', 'networking', 'other']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: 100
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved_by_head', 'approved_by_principal'],
    default: 'pending'
  },
  circular: {
    type: String,
    default: ''
  },
  circularSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for text search
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
