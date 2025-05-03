const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Eventify Database Setup ===');
console.log('This script will help you set up the MongoDB connection for Eventify.\n');

const envPath = path.join(__dirname, '.env');

// Check if .env already exists
const envExists = fs.existsSync(envPath);
if (envExists) {
  console.log('An .env file already exists. Do you want to overwrite it? (y/n)');
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile();
    } else {
      console.log('Setup cancelled. Your existing .env file was not modified.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log('\nPlease enter your MongoDB connection string:');
  console.log('(Default: mongodb://localhost:27017/eventify)');
  
  rl.question('> ', (mongoUri) => {
    // Use default if no input provided
    const uri = mongoUri.trim() || 'mongodb://localhost:27017/eventify';
    
    console.log('\nEnter a JWT secret (used for authentication tokens):');
    console.log('(Default: eventify-secure-jwt-secret-2025)');
    
    rl.question('> ', (jwtSecret) => {
      // Use default if no input provided
      const secret = jwtSecret.trim() || 'eventify-secure-jwt-secret-2025';
      
      console.log('\nEnter the server port:');
      console.log('(Default: 5001)');
      
      rl.question('> ', (port) => {
        // Use default if no input provided
        const serverPort = port.trim() || '5001';
        
        // Create .env content
        const envContent = `# Database Configuration
MONGO_URI=${uri}

# JWT Configuration
JWT_SECRET=${secret}
JWT_EXPIRE=7d

# Server Configuration
PORT=${serverPort}
NODE_ENV=development
`;
        
        // Write to file
        fs.writeFileSync(envPath, envContent);
        
        console.log('\n✅ .env file created successfully!');
        console.log(`📁 Location: ${envPath}`);
        console.log('\nYou can now start the server with:');
        console.log('  npm run server\n');
        
        rl.close();
      });
    });
  });
}

rl.on('close', () => {
  process.exit(0);
}); 