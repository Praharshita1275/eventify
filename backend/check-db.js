// Database connection check script
const mongoose = require('mongoose');
require('dotenv').config();

const checkDB = async () => {
  console.log('Checking MongoDB connection...');
  
  // Get the MongoDB URI from environment
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    console.error('ERROR: MongoDB URI is not defined in environment variables');
    console.log('Make sure you have a .env file with MONGO_URI defined');
    return;
  }
  
  console.log('MongoDB URI format check:');
  // Check if it has the mongodb:// or mongodb+srv:// prefix
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('ERROR: MongoDB URI does not have the correct prefix (mongodb:// or mongodb+srv://)');
  } else {
    console.log('✓ URI has correct prefix');
  }
  
  // Check if it contains username:password@
  if (!uri.includes('@')) {
    console.warn('WARNING: MongoDB URI might not include authentication credentials');
  } else {
    console.log('✓ URI appears to include authentication');
  }
  
  try {
    // Try connecting to MongoDB
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✓ Successfully connected to MongoDB');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Check if we can perform a basic operation
    console.log('Testing database operations...');
    
    // Create a temporary model
    const TempModel = mongoose.model('TempTest', new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    }));
    
    // Try to create a document
    const testDoc = await TempModel.create({
      name: 'Connection Test',
    });
    
    console.log(`✓ Successfully created test document with ID: ${testDoc._id}`);
    
    // Clean up - delete the test document
    await TempModel.findByIdAndDelete(testDoc._id);
    console.log('✓ Successfully deleted test document');
    
    console.log('All MongoDB checks passed! Database is working correctly.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    try {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  }
};

// Run the check
checkDB(); 