const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    username: 'aec_admin',
    email: 'aec@cbit.ac.in',
    password: 'aec123456',
    role: 'AEC',
    college: 'CBIT',
    department: 'CSE'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Create new users
    const createdUsers = await User.create(users);
    console.log('Created new users:', createdUsers);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();