const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a resource name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Audio', 'Video', 'Furniture', 'Technical', 'Venue', 'Other']
  },
  totalQuantity: {
    type: Number,
    required: [true, 'Please add total quantity'],
    default: 1
  },
  availableQuantity: {
    type: Number,
    default: function() {
      return this.totalQuantity;
    }
  },
  image: {
    type: String,
    default: 'default-resource.jpg'
  },
  bookings: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    quantity: {
      type: Number,
      default: 1
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set isAvailable based on availableQuantity
ResourceSchema.pre('save', function(next) {
  this.isAvailable = this.availableQuantity > 0;
  next();
});

module.exports = mongoose.model('Resource', ResourceSchema);