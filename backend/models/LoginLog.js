const mongoose = require('mongoose');

const LoginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'other', 'AEC', 'coordinator', 'Club Head', 'Director of Student Affairs', 'Director of IQAC', 'CDC'],
    default: 'member'
  },
  success: {
    type: Boolean,
    required: true
  },
  ipAddress: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoginLog', LoginLogSchema);
