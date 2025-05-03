const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');

async function createSampleCircular() {
  try {
    const sampleCircular = {
      title: 'Circular: Annual Sports Day',
      content: `
CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY

NAME: Annual Sports Day
DATE: 2024-09-15
TIME: 10:00 AM
VENUE: College Grounds
PREPARATION TIME (if any): 1 hour before event

SIGN OF PRINCIPAL
STATUS: GREEN
      `,
      category: 'circular',
      createdBy: mongoose.Types.ObjectId('000000000000000000000000'), // Replace with valid user ID
      date: new Date('2024-09-01T09:00:00Z'),
      isActive: true
    };

    const circular = await Announcement.create(sampleCircular);
    console.log('Sample circular created:', circular);
  } catch (error) {
    console.error('Error creating sample circular:', error);
  }
}

module.exports = createSampleCircular;
