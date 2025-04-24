// routes/events.js

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const eventController = require('../controllers/eventController');


// Get all events
router.get('/', eventController.getEvents);

// Get event by ID
router.get('/:id', eventController.getEvent);

// Create new event
router.post('/', protect, checkRole('admin'), eventController.createEvent);

// Update event
router.put('/:id', protect, eventController.updateEvent);

// Delete event
router.delete('/:id', protect, eventController.deleteEvent);

// Update event approval status (only authorized roles)
router.put('/:id/approval', protect, checkRole('admin'), eventController.updateApprovalStatus);

// Generate circular for event (only principal)
router.post('/:id/circular', protect, checkRole('principal'), eventController.generateCircular);

// Mark circular as sent and update calendar/events (only principal)
router.post('/:id/circular/send', protect, checkRole('principal'), eventController.sendCircular);


// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      // In a real app, you'd get the organizer ID from authentication
      organizer: req.body.organizer || '60d21b4667d0d8992e610c85' // placeholder ID
    });
    
    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // In a real app, check if user is the organizer
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // In a real app, check if user is the organizer
    
    await event.remove();
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;