const mongoose = require('mongoose');
const retry = require('async-retry');
const config = require('./config');

const connectDB = async () => {
  await retry(
    async () => {
      const conn = await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Updated parameter name
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      // Connection events
      mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
      });

      mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
      });
    },
    {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 5000,
    }
  );
};

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;
