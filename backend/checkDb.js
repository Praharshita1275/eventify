const connectDB = require('./config/db');
require('dotenv').config();

async function checkDatabaseConnection() {
  console.log('Checking database connection...');
  
  try {
    // Attempt to connect to the database
    const conn = await connectDB();
    
    // If connection is successful, print connection info
    console.log(`MongoDB connected successfully!`);
    console.log(`Connection host: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Close the connection
    console.log('Closing database connection...');
    await conn.connection.close();
    console.log('Connection closed successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
}

// Run the check
checkDatabaseConnection(); 