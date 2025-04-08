const Event = require('../models/Event');
const User = require('../models/User');
const Resource = require('../models/Resource');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin, Coordinator)
exports.createEvent = async (req, res) => {
  try {
    // Add organizer to req.body
    req.body.organizer = req.user.id;
    
    // Create event
    const event = await Event.create(req.body);
    
    // Add event to user's organized events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { eventsOrganized: event._id }
    });
    
    // If resources are included, update resource bookings
    if (req.body.resources && req.body.resources.length > 0) {
      for (const resourceItem of req.body.resources) {
        const resource = await Resource.findById(resourceItem.resource);
        
        if (resource) {
          // Add booking to resource
          resource.bookings.push({
            event: event._id,
            quantity: resourceItem.quantity,
            startDate: new Date(req.body.date + 'T' + req.body.startTime),
            endDate: new Date(req.body.date + 'T' + req.body.endTime)
          });
          
          // Update available quantity
          resource.availableQuantity -= resourceItem.quantity;
          
          await resource.save();
        }
      }
    }
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
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
    let query = Event.find(JSON.parse(queryStr))
      .populate('organizer', 'username email profilePicture')
      .populate('resources.resource', 'name category');
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { clubName: searchRegex },
          { venue: searchRegex },
          { tags: searchRegex }
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
      query = query.sort('-date');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments(query.getQuery());

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const events = await query;

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
      count: events.length,
      pagination,
      total,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username email profilePicture')
      .populate('resources.resource', 'name category image')
      .populate('attendees.user', 'username email profilePicture')
      .populate('feedbacks');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin, event organizer)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Make sure user is event organizer or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this event`
      });
    }

    // Handle resource updates if provided
    if (req.body.resources && req.body.resources.length > 0) {
      // First release previously booked resources
      if (event.resources && event.resources.length > 0) {
        for (const resourceItem of event.resources) {
          const resource = await Resource.findById(resourceItem.resource);
          
          if (resource) {
            // Remove booking from resource
            resource.bookings = resource.bookings.filter(
              booking => booking.event.toString() !== event._id.toString()
            );
            
            // Restore available quantity
            resource.availableQuantity += resourceItem.quantity;
            
            await resource.save();
          }
        }
      }
      
      // Book new resources
      for (const resourceItem of req.body.resources) {
        const resource = await Resource.findById(resourceItem.resource);
        
        if (resource) {
          // Add booking to resource
          resource.bookings.push({
            event: event._id,
            quantity: resourceItem.quantity,
            startDate: new Date(req.body.date + 'T' + req.body.startTime),
            endDate: new Date(req.body.date + 'T' + req.body.endTime)
          });
          
          // Update available quantity
          resource.availableQuantity -= resourceItem.quantity;
          
          await resource.save();
        }
      }
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'username email');

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin, event organizer)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Make sure user is event organizer or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this event`
      });
    }

    // Release booked resources
    if (event.resources && event.resources.length > 0) {
      for (const resourceItem of event.resources) {
        const resource = await Resource.findById(resourceItem.resource);
        
        if (resource) {
          // Remove booking from resource
          resource.bookings = resource.bookings.filter(
            booking => booking.event.toString() !== event._id.toString()
          );
          
          // Restore available quantity
          resource.availableQuantity += resourceItem.quantity;
          
          await resource.save();
        }
      }
    }

    // Remove event from organizer's eventsOrganized array
    await User.findByIdAndUpdate(event.organizer, {
      $pull: { eventsOrganized: event._id }
    });

    // Remove event from attendees' eventsAttending array
    if (event.attendees && event.attendees.length > 0) {
      for (const attendee of event.attendees) {
        await User.findByIdAndUpdate(attendee.user, {
          $pull: { eventsAttending: event._id }
        });
      }
    }

    // Delete the event
    await event.remove();

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

// @desc    Register user for event
// @route   POST /api/events/:id/register
// @access  Private (Any authenticated user)
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Check if event has available slots
    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event has reached maximum attendee capacity'
      });
    }

    // Check if user is already registered
    const isRegistered = event.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );

    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'User already registered for this event'
      });
    }

    // Register user for event
    event.attendees.push({
      user: req.user.id,
      registrationDate: Date.now()
    });

    await event.save();

    // Add event to user's attending events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { eventsAttending: event._id }
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel registration for event
// @route   DELETE /api/events/:id/register
// @access  Private (Registered user)
exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Check if user is registered
    const isRegistered = event.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );

    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'User not registered for this event'
      });
    }

    // Remove user from event attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.user.toString() !== req.user.id
    );

    await event.save();

    // Remove event from user's attending events
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { eventsAttending: event._id }
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add feedback to event
// @route   POST /api/events/:id/feedback
// @access  Private (Registered attendee)
exports.addFeedback = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Check if user attended the event
    const attended = event.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );

    if (!attended) {
      return res.status(400).json({
        success: false,
        message: 'Only attendees can provide feedback'
      });
    }

    // Check if event has ended
    const eventEndDate = new Date(event.date + 'T' + event.endTime);
    if (new Date() < eventEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be provided after the event has ended'
      });
    }

    // Add feedback
    const feedback = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: Date.now()
    };

    event.feedbacks.push(feedback);
    await event.save();

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get upcoming events for user
// @route   GET /api/events/user/upcoming
// @access  Private
exports.getUserUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    
    // Find events where user is registered and event date is in the future
    const events = await Event.find({
      'attendees.user': req.user.id,
      date: { $gte: today.toISOString().split('T')[0] }
    })
      .populate('organizer', 'username email profilePicture')
      .populate('resources.resource', 'name category')
      .sort('date startTime');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get past events for user
// @route   GET /api/events/user/past
// @access  Private
exports.getUserPastEvents = async (req, res) => {
  try {
    const today = new Date();
    
    // Find events where user is registered and event date is in the past
    const events = await Event.find({
      'attendees.user': req.user.id,
      date: { $lt: today.toISOString().split('T')[0] }
    })
      .populate('organizer', 'username email profilePicture')
      .populate('resources.resource', 'name category')
      .sort('-date -startTime');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};