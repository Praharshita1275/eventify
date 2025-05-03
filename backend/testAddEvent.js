const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

// Import models
const Event = require('./models/Event');
const User = require('./models/User');

async function addTestEvent() {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('Connected to database, attempting to create a test event...');
    
    // Find a user to be the organizer (admin user)
    const organizer = await User.findOne({ role: 'AEC' });
    
    if (!organizer) {
      throw new Error('No admin user found to be the organizer');
    }
    
    console.log(`Found organizer: ${organizer.username} (${organizer._id})`);
    
    // Create a test event
    const testEvent = new Event({
      title: 'Test Event',
      description: 'This is a test event created by the script',
      date: new Date('2025-05-15'),
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      venue: 'Test Venue',
      category: 'Technical',
      organizer: organizer._id,
      maxAttendees: 50,
      status: 'approved',
      approvedBy: organizer._id,
      approvalDate: new Date()
    });
    
    // Save the event to the database
    const savedEvent = await testEvent.save();
    
    console.log('Test event created successfully:');
    console.log(JSON.stringify(savedEvent, null, 2));
    
    // Verify by querying the database
    const foundEvent = await Event.findOne({ title: 'Test Event' });
    console.log('Found event by query:');
    console.log(JSON.stringify(foundEvent, null, 2));
    
    // Check if the event appears in the events collection
    console.log('Checking events collection directly...');
    const rawEvents = await mongoose.connection.db.collection('events').find({ title: 'Test Event' }).toArray();
    console.log(`Found ${rawEvents.length} events in the collection`);
    if (rawEvents.length > 0) {
      console.log(JSON.stringify(rawEvents[0], null, 2));
    }
    
    // Disconnect from the database
    await mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.errors) {
      // Print validation errors in detail
      Object.keys(error.errors).forEach(field => {
        console.error(`Field "${field}": ${error.errors[field].message}`);
      });
    }
    
    // Ensure connection is closed even if there's an error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Database connection closed after error.');
    }
    
    process.exit(1);
  }
}

// Run the test
addTestEvent(); 