const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to the database
async function checkCollections() {
  try {
    const conn = await connectDB();
    console.log('MongoDB Connected');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in the database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Count documents in each collection
    console.log('\nDocument count in each collection:');
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Clear specific collection
async function clearCollection(collectionName) {
  try {
    const conn = await connectDB();
    console.log('MongoDB Connected');
    
    if (!collectionName) {
      console.error('Please provide a collection name');
      process.exit(1);
    }
    
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(collection => collection.name === collectionName);
    
    if (!collectionExists) {
      console.error(`Collection '${collectionName}' does not exist`);
      process.exit(1);
    }
    
    // Clear the collection
    const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
    console.log(`Collection '${collectionName}' cleared: ${result.deletedCount} documents deleted`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const collectionName = args[1];

if (command === 'check') {
  checkCollections();
} else if (command === 'clear' && collectionName) {
  clearCollection(collectionName);
} else {
  console.log('Usage:');
  console.log('  node dbUtils.js check                - List all collections and document counts');
  console.log('  node dbUtils.js clear <collection>   - Clear a specific collection');
} 