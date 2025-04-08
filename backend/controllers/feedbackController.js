const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'username email profilePicture')
      .populate('event', 'title date');

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get feedback for a specific event
// @route   GET /api/feedback/event/:eventId
// @access  Private (Admin, Event Organizer)
exports.getEventFeedback = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.eventId}`
      });
    }

    // Check if user is event organizer or admin
    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this event feedback'
      });
    }

    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'username email profilePicture');

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create feedback
// @route   POST /api/feedback/event/:eventId
// @access  Private (Event Attendee)
exports.createFeedback = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.eventId}`
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

    // Check if user has already provided feedback
    const existingFeedback = await Feedback.findOne({
      event: req.params.eventId,
      user: req.user.id
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already provided feedback for this event'
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      rating: req.body.rating,
      comment: req.body.comment,
      event: req.params.eventId,
      user: req.user.id
    });

    // Add feedback to event
    event.feedbacks.push(feedback._id);
    await event.save();

    res.status(201).json({
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

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private (Feedback Creator)
exports.updateFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found with id of ${req.params.id}`
      });
    }

    // Make sure user is feedback creator or admin
    if (
      feedback.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this feedback'
      });
    }

    // Update feedback
    feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Feedback Creator, Admin)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found with id of ${req.params.id}`
      });
    }

    // Make sure user is feedback creator or admin
    if (
      feedback.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this feedback'
      });
    }

    // Remove feedback reference from event
    await Event.findByIdAndUpdate(feedback.event, {
      $pull: { feedbacks: feedback._id }
    });

    // Delete feedback
    await feedback.remove();

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

// @desc    Get user's feedback
// @route   GET /api/feedback/user
// @access  Private
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id })
      .populate('event', 'title date');

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};