const Resource = require('../models/Resource');
const Event = require('../models/Event');

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private (Admin)
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Build query
    let query = Resource.find(JSON.parse(queryStr));
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('name');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Resource.countDocuments(query.getQuery());

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const resources = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: resources.length,
      pagination,
      total,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Admin)
exports.updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id of ${req.params.id}`
      });
    }

    // Don't allow directly updating availableQuantity or bookings through this endpoint
    if (req.body.availableQuantity !== undefined || req.body.bookings !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'Cannot directly update availableQuantity or bookings'
      });
    }

    // Handle total quantity update
    if (req.body.totalQuantity !== undefined) {
      // Calculate the difference between new and old total quantity
      const quantityDifference = req.body.totalQuantity - resource.totalQuantity;
      
      // Update availableQuantity accordingly
      req.body.availableQuantity = resource.availableQuantity + quantityDifference;
      
      // Check if new availableQuantity is valid
      if (req.body.availableQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reduce total quantity below current bookings'
        });
      }
    }

    // Update resource
    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id of ${req.params.id}`
      });
    }

    // Check if resource is currently booked
    if (resource.bookings && resource.bookings.length > 0) {
      // Find active bookings (future events)
      const now = new Date();
      const activeBookings = resource.bookings.filter(booking => 
        booking.endDate > now
      );

      if (activeBookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete resource with active bookings'
        });
      }
    }

    // Remove resource references from events
    const events = await Event.find({ 'resources.resource': req.params.id });
    
    for (const event of events) {
      event.resources = event.resources.filter(
        resourceItem => resourceItem.resource.toString() !== req.params.id
      );
      await event.save();
    }

    // Delete resource
    await resource.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get resource availability
// @route   GET /api/resources/:id/availability
// @access  Public
exports.getResourceAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id of ${req.params.id}`
      });
    }

    // Get bookings for the specified date
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');
    
    const bookingsOnDate = resource.bookings.filter(booking => {
      return booking.startDate >= startOfDay && booking.startDate <= endOfDay;
    });

    // Create a timeline of availability
    const timeline = [];
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
                      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    
    for (const timeSlot of timeSlots) {
      const slotTime = new Date(date + 'T' + timeSlot + ':00.000Z');
      
      let quantityBooked = 0;
      
      // Calculate booked quantity for this time slot
      for (const booking of bookingsOnDate) {
        if (booking.startDate <= slotTime && booking.endDate > slotTime) {
          quantityBooked += booking.quantity;
        }
      }
      
      timeline.push({
        time: timeSlot,
        available: resource.totalQuantity - quantityBooked,
        booked: quantityBooked
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resource: {
          _id: resource._id,
          name: resource.name,
          totalQuantity: resource.totalQuantity
        },
        timeline
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check resource availability for booking
// @route   POST /api/resources/check-availability
// @access  Public
exports.checkResourceAvailability = async (req, res) => {
  try {
    const { resources, date, startTime, endTime } = req.body;
    
    if (!resources || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resources, date, startTime and endTime'
      });
    }

    const startDateTime = new Date(date + 'T' + startTime);
    const endDateTime = new Date(date + 'T' + endTime);
    
    const availability = [];
    
    for (const resourceItem of resources) {
      const resource = await Resource.findById(resourceItem.resource);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `Resource not found with id of ${resourceItem.resource}`
        });
      }
      
      // Calculate booked quantity for requested time period
      let quantityBooked = 0;
      
      for (const booking of resource.bookings) {
        // Check if booking overlaps with requested time period
        if (
          (booking.startDate <= startDateTime && booking.endDate > startDateTime) ||
          (booking.startDate < endDateTime && booking.endDate >= endDateTime) ||
          (booking.startDate >= startDateTime && booking.endDate <= endDateTime)
        ) {
          quantityBooked += booking.quantity;
        }
      }
      
      const availableQuantity = resource.totalQuantity - quantityBooked;
      const isAvailable = availableQuantity >= resourceItem.quantity;
      
      availability.push({
        resource: {
          _id: resource._id,
          name: resource.name
        },
        requestedQuantity: resourceItem.quantity,
        availableQuantity,
        isAvailable
      });
    }
    
    // Check if all resources are available
    const allAvailable = availability.every(item => item.isAvailable);
    
    res.status(200).json({
      success: true,
      data: {
        date,
        startTime,
        endTime,
        allAvailable,
        resources: availability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};