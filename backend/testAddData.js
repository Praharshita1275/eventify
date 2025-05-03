const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

// Import the User model
const User = require('./models/User');

async function addTestUser() {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('Connected to database, attempting to create a test user...');
    
    // Create a test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      college: 'Test College',
      department: 'Computer Science'
    });
    
    // Save the user to the database
    const savedUser = await testUser.save();
    
    console.log('Test user created successfully:');
    console.log(JSON.stringify(savedUser, null, 2));
    
    // Verify by querying the database
    const foundUser = await User.findOne({ username: 'testuser' });
    console.log('Found user by query:');
    console.log(JSON.stringify(foundUser, null, 2));
    
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
addTestUser(); 