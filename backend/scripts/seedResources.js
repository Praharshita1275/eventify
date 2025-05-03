const mongoose = require('mongoose');
const config = require('../config/config');
const Resource = require('../models/Resource');

const resources = [
  {
    name: 'Assembly Hall',
    location: 'Main Block',
    capacity: 500,
    type: 'Event Hall',
    category: 'Venue',
    description: 'Large hall for college gatherings, events, and functions.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning', 'Stage', 'Seating'],
    image: '/images/assembly-hall.jpg',
    available: true
  },
  {
    name: 'N Block Seminar Hall',
    location: 'N Block',
    capacity: 150,
    type: 'Seminar Hall',
    category: 'Venue',
    description: 'Modern seminar hall equipped with presentation facilities.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning', 'Podium'],
    image: '/images/n-block-seminar.jpg',
    available: true
  },
  {
    name: 'D Block Seminar Hall',
    location: 'D Block',
    capacity: 120,
    type: 'Seminar Hall',
    category: 'Venue',
    description: 'Seminar hall suitable for department meetings and presentations.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning'],
    image: '/images/d-block-seminar.jpg',
    available: true
  },
  {
    name: 'Conference Hall',
    location: 'E Block',
    capacity: 50,
    type: 'Conference Room',
    category: 'Venue',
    description: 'Formal conference room for meetings and discussions.',
    amenities: ['Projector', 'Video Conferencing', 'Air Conditioning', 'Whiteboard'],
    image: '/images/conference-hall.jpg',
    available: true
  },
  {
    name: 'CSE E-Classroom',
    location: 'CSE Department',
    capacity: 60,
    type: 'Classroom',
    category: 'Technical',
    description: 'Digital classroom with interactive teaching facilities.',
    amenities: ['Interactive Board', 'Computers', 'Air Conditioning'],
    image: '/images/cse-eclassroom.jpg',
    available: true
  },
  {
    name: 'CSE Labs',
    location: 'CSE Department',
    capacity: 80,
    type: 'Laboratory',
    category: 'Technical',
    description: 'Computer labs with high-performance systems for technical sessions.',
    amenities: ['High-end Computers', 'Software Tools', 'Air Conditioning'],
    image: '/images/cse-labs.jpg',
    available: true
  },
  {
    name: 'AI/DS Labs',
    location: 'AI/DS Department',
    capacity: 60,
    type: 'Laboratory',
    category: 'Technical',
    description: 'Specialized labs for AI and Data Science projects.',
    amenities: ['GPU Workstations', 'AI Software', 'Air Conditioning'],
    image: '/images/aids-labs.jpg',
    available: true
  },
  {
    name: 'IT Labs',
    location: 'IT Department',
    capacity: 70,
    type: 'Laboratory',
    category: 'Technical',
    description: 'IT labs for networking and software development.',
    amenities: ['Computers', 'Networking Equipment', 'Air Conditioning'],
    image: '/images/it-labs.jpg',
    available: true
  },
  {
    name: 'TPO Hall',
    location: 'Training & Placement Office',
    capacity: 200,
    type: 'Event Hall',
    category: 'Venue',
    description: 'Hall for placement drives and corporate events.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning', 'Interview Rooms'],
    image: '/images/tpo-hall.jpg',
    available: true
  },
  {
    name: 'Open Air Auditorium',
    location: 'Campus Grounds',
    capacity: 1000,
    type: 'Outdoor Venue',
    category: 'Venue',
    description: 'Open space for large gatherings and cultural events.',
    amenities: ['Stage', 'Sound System', 'Lighting'],
    image: '/images/open-air.jpg',
    available: true
  }
];

async function seedResources() {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await Resource.deleteMany({});
    await Resource.insertMany(resources);
    console.log('Resources seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding resources:', err);
    process.exit(1);
  }
}

seedResources(); 