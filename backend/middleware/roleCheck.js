// Middleware to check user role
exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Middleware to check if user is an organizer of the event
exports.isEventOrganizer = async (req, res, next) => {
    try {
      const Event = require('../models/Event');
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: `Event not found with id of ${req.params.id}`
        });
      }
      
      // Check if user is event organizer or admin
      if (
        event.organizer.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to perform this action'
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };