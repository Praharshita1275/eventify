// Mock data for CBIT resources and facilities
export const CBIT_RESOURCES = [
  {
    id: 'r1',
    name: 'Assembly Hall',
    location: 'Main Block',
    capacity: 500,
    type: 'Event Hall',
    description: 'Large hall for college gatherings, events, and functions.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning', 'Stage', 'Seating'],
    image: '/images/assembly-hall.jpg',
    available: true
  },
  {
    id: 'r2',
    name: 'N Block Seminar Hall',
    location: 'N Block',
    capacity: 150,
    type: 'Seminar Hall',
    description: 'Modern seminar hall equipped with presentation facilities.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning', 'Podium'],
    image: '/images/n-block-seminar.jpg',
    available: true
  },
  {
    id: 'r3',
    name: 'D Block Seminar Hall',
    location: 'D Block',
    capacity: 120,
    type: 'Seminar Hall',
    description: 'Seminar hall suitable for department meetings and presentations.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning'],
    image: '/images/d-block-seminar.jpg',
    available: true
  },
  {
    id: 'r4',
    name: 'Conference Hall',
    location: 'E Block',
    capacity: 50,
    type: 'Conference Room',
    description: 'Formal conference room for meetings and discussions.',
    amenities: ['Projector', 'Video Conferencing', 'Air Conditioning', 'Whiteboard'],
    image: '/images/conference-hall.jpg',
    available: true
  },
  {
    id: 'r5',
    name: 'CSE E-Classroom',
    location: 'CSE Department',
    capacity: 60,
    type: 'Classroom',
    description: 'Digital classroom with interactive teaching facilities.',
    amenities: ['Interactive Board', 'Computers', 'Air Conditioning'],
    image: '/images/cse-eclassroom.jpg',
    available: true
  },
  {
    id: 'r6',
    name: 'CSE Labs',
    location: 'CSE Department',
    capacity: 80,
    type: 'Laboratory',
    description: 'Computer labs with high-performance systems for technical sessions.',
    amenities: ['High-end Computers', 'Software Tools', 'Air Conditioning'],
    image: '/images/cse-labs.jpg',
    available: true
  },
  {
    id: 'r7',
    name: 'AI/DS Labs',
    location: 'AI/DS Department',
    capacity: 60,
    type: 'Laboratory',
    description: 'Specialized labs for AI and Data Science projects.',
    amenities: ['GPU Workstations', 'AI Software', 'Air Conditioning'],
    image: '/images/aids-labs.jpg',
    available: true
  },
  {
    id: 'r8',
    name: 'IT Labs',
    location: 'IT Department',
    capacity: 70,
    type: 'Laboratory',
    description: 'IT labs for networking and software development.',
    amenities: ['Computers', 'Networking Equipment', 'Air Conditioning'],
    image: '/images/it-labs.jpg',
    available: true
  },
  {
    id: 'r9',
    name: 'TPO Hall',
    location: 'Training & Placement Office',
    capacity: 200,
    type: 'Event Hall',
    description: 'Hall for placement drives and corporate events.',
    amenities: ['Projector', 'Sound System', 'Air Conditioning', 'Interview Rooms'],
    image: '/images/tpo-hall.jpg',
    available: true
  },
  {
    id: 'r10',
    name: 'Open Air Auditorium',
    location: 'Campus Grounds',
    capacity: 1000,
    type: 'Outdoor Venue',
    description: 'Open space for large gatherings and cultural events.',
    amenities: ['Stage', 'Sound System', 'Lighting'],
    image: '/images/open-air.jpg',
    available: true
  }
];

// Mock bookings data
export const MOCK_BOOKINGS = [
  {
    id: 'b1',
    resourceId: 'r1',
    eventTitle: 'Annual Day Function',
    bookedBy: 'Cultural Club',
    contactEmail: 'cultural@cbit.ac.in',
    startDate: '2025-05-20T09:00:00',
    endDate: '2025-05-20T18:00:00',
    status: 'approved'
  },
  {
    id: 'b2',
    resourceId: 'r2',
    eventTitle: 'Technical Workshop on Cloud Computing',
    bookedBy: 'CSE Department',
    contactEmail: 'cse@cbit.ac.in',
    startDate: '2025-05-15T10:00:00',
    endDate: '2025-05-15T16:00:00',
    status: 'approved'
  },
  {
    id: 'b3',
    resourceId: 'r4',
    eventTitle: 'Faculty Meeting',
    bookedBy: 'Dean Office',
    contactEmail: 'dean@cbit.ac.in',
    startDate: '2025-05-12T14:00:00',
    endDate: '2025-05-12T16:00:00',
    status: 'pending'
  },
  {
    id: 'b4',
    resourceId: 'r6',
    eventTitle: 'Coding Competition',
    bookedBy: 'Coding Club',
    contactEmail: 'coding@cbit.ac.in',
    startDate: '2025-05-18T09:00:00',
    endDate: '2025-05-18T17:00:00',
    status: 'approved'
  }
]; 