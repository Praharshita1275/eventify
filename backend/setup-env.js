const fs = require('fs');
const path = require('path');

const ENV_FILE_PATH = path.join(__dirname, '.env');
const ENV_CONTENT = `MONGO_URI=mongodb://localhost:27017/eventify
JWT_SECRET=eventify-secure-jwt-secret-2025
JWT_EXPIRE=7d
PORT=5001
NODE_ENV=development
`;

// Check if .env file already exists
if (fs.existsSync(ENV_FILE_PATH)) {
  console.log('.env file already exists. Not overwriting.');
} else {
  // Create .env file
  fs.writeFileSync(ENV_FILE_PATH, ENV_CONTENT);
  console.log('.env file created successfully!');
}

console.log('Required environment variables:');
console.log('- MONGO_URI: MongoDB connection string');
console.log('- JWT_SECRET: Secret key for JWT token generation');
console.log('- JWT_EXPIRE: JWT token expiration time');
console.log('- PORT: Server port number');
console.log('- NODE_ENV: Application environment (development/production)'); 