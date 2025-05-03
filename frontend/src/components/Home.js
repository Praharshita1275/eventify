import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaClock, FaMapMarkerAlt, FaBullhorn, FaArrowRight, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import api from '../services/api';
import '../styles/animations.css';
import Navbar from './Navbar';

// Mock data for when API calls fail
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Technical Workshop on AI",
    description: "Learn about the latest advancements in Artificial Intelligence and Machine Learning.",
    date: "2025-05-15",
    time: "10:00 AM - 1:00 PM",
    venue: "Seminar Hall 1",
    organizer: "CSE Department"
  },
  {
    id: 2,
    title: "Cultural Fest - Shruthi",
    description: "Annual cultural festival with music, dance, and art performances.",
    date: "2025-05-20",
    time: "9:00 AM - 6:00 PM",
    venue: "College Auditorium",
    organizer: "Student Council"
  },
  {
    id: 3,
    title: "Industry Connect Program",
    description: "Connect with industry professionals and learn about career opportunities.",
    date: "2025-05-25",
    time: "2:00 PM - 5:00 PM",
    venue: "Conference Hall",
    organizer: "Training & Placement Cell"
  }
];

function Home() {
  const location = useLocation();
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [colorProgress, setColorProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const showNavbarThreshold = viewportHeight * 0.3; // Show navbar after 30% of viewport height
      const maxScroll = 500; // Maximum scroll distance for full color transition
      
      // Calculate progress for color transition
      const colorProgressValue = Math.min(scrollY / maxScroll, 1);
      // Calculate progress for navbar visibility
      const navProgress = Math.min(scrollY / showNavbarThreshold, 1);
      
      setScrollProgress(navProgress);
      setColorProgress(colorProgressValue);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.unauthorized) {
      setUnauthorizedMessage(location.state.message || 'You do not have permission to access the requested page.');
    }
  }, [location]);

  useEffect(() => {
    fetchRecentEvents();
    // Simulate visitor count with a random two-digit number between 10 and 99
    const randomCount = Math.floor(Math.random() * 90) + 10;
    setVisitorCount(randomCount);
  }, []);

  const fetchRecentEvents = async () => {
    try {
      const response = await api.get('/events?limit=3');
      if (response.data.success) {
        // Filter out events whose date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time for comparison
        const filteredEvents = response.data.data.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });
        setRecentEvents(filteredEvents);
      } else {
        console.log('Using mock event data due to API error');
        // Filter mock events as well
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredMockEvents = MOCK_EVENTS.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });
        setRecentEvents(filteredMockEvents);
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching recent events:', error);
      // Filter mock events as well
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredMockEvents = MOCK_EVENTS.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
      setRecentEvents(filteredMockEvents);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to interpolate between colors
  const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return `rgb(${result.join(',')})`;
  };

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  // Calculate colors based on scroll progress
  const getBackgroundGradient = (progress) => {
    const startColor1 = hexToRgb('#1a365d');
    const startColor2 = hexToRgb('#2b6cb0');
    const endColor1 = hexToRgb('#ffffff');
    const endColor2 = hexToRgb('#e0e7ff');

    const currentColor1 = interpolateColor(startColor1, endColor1, progress);
    const currentColor2 = interpolateColor(startColor2, endColor2, progress);

    return `linear-gradient(135deg, ${currentColor1} 0%, ${currentColor2} 100%)`;
  };

  // eslint-disable-next-line no-unused-vars
  const getTextColor = () => {
    const startColor = hexToRgb('#ffffff');
    const endColor = hexToRgb('#1a365d');
    return interpolateColor(startColor, endColor, colorProgress);
  };

  const getSubtitleColor = () => {
    // Start: a very light blue, End: a medium blue-gray
    const startColor = [227, 237, 250]; // #e3edfa
    const endColor = [39, 68, 114];     // #274472
    return interpolateColor(startColor, endColor, colorProgress);
  };

  return (
    <div 
      className="min-h-screen transition-all duration-700" 
      style={{ 
        background: getBackgroundGradient(colorProgress),
      }}
    >
      {/* Navbar that appears after scrolling */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
          scrollProgress > 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{
          background: getBackgroundGradient(colorProgress),
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.6)', // fallback for extra glassy effect
        }}
      >
        <Navbar />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="h-screen flex flex-col items-center justify-center text-center animate-fade-in relative">
          <div className="flex flex-col items-center">
            <h1 
              className="text-8xl md:text-9xl font-bold tracking-tight"
              style={{ 
                color: scrollProgress === 0 ? '#ffffff' : '#1a365d'
              }}
            >
              Eventify
            </h1>
            <div className="w-full flex flex-col items-center mb-12">
              <p
                className="text-2xl leading-relaxed text-center"
                style={{
                  color: getSubtitleColor(),
                  fontWeight: 450,
                  marginBottom: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100vw',
                  textShadow: '0 1px 4px rgba(26,54,93,0.08)'
                }}
              >
                Your comprehensive college event management platform.
              </p>
              <p
                className="text-2xl leading-relaxed text-center"
                style={{
                  color: getSubtitleColor(),
                  fontWeight: 450,
                  marginTop: 0,
                  marginBottom: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100vw',
                  textShadow: '0 1px 4px rgba(26,54,93,0.08)'
                }}
              >
                Discover, participate, and stay connected.
              </p>
            </div>

            {/* Get Started Button */}
            <Link
              to="/about"
              className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:text-white ${
                scrollProgress === 0 
                  ? 'text-white bg-[#1a365d]/90 hover:bg-[#1a365d]' 
                  : 'text-white bg-[#2b6cb0] hover:bg-[#1a365d]'
              }`}
            >
              Get Started
              <FaArrowRight className="ml-3" />
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-16 w-full flex justify-center">
            <div className="flex flex-col items-center animate-bounce">
              <p 
                className="text-lg font-medium mb-3"
                style={{ 
                  color: scrollProgress === 0 ? 'rgba(255, 255, 255, 0.9)' : '#4a5568'
                }}
              >
                Scroll to explore
              </p>
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ 
                  color: scrollProgress === 0 ? 'rgba(255, 255, 255, 0.9)' : '#4a5568'
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Unauthorized Message */}
          {unauthorizedMessage && (
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                <div className="flex">
                  <FaExclamationTriangle className="text-yellow-500 mt-0.5 mr-3 h-5 w-5" />
                  <p className="text-sm text-yellow-700">{unauthorizedMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Note: Currently displaying sample data. Some features may be limited until connection to the server is restored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Eventify Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-3xl font-bold text-[#1a365d] mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <FaUsers className="h-6 w-6 text-[#1a365d]" />
                </span>
                About Eventify
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg mb-8 leading-relaxed">
                  Eventify is your comprehensive college event management platform designed specifically for CBIT students and faculty. Our platform streamlines the way you discover, participate in, and manage college activities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-[#1a365d] mb-4 flex items-center">
                      <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <FaUsers className="h-5 w-5 text-[#1a365d]" />
                      </span>
                      For Students
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Stay updated with latest college events and activities
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Access study materials and resources
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Participate in discussions and forums
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Get instant notifications for important announcements
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-[#1a365d] mb-4 flex items-center">
                      <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <FaUsers className="h-5 w-5 text-[#1a365d]" />
                      </span>
                      For Faculty
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Create and manage department events
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Share academic resources and materials
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Make important announcements
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="h-2 w-2 bg-[#1a365d] rounded-full mr-3"></span>
                        Track event participation and engagement
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <FaCalendarAlt className="h-8 w-8 text-[#1a365d]" />,
                  title: "Events",
                  description: "View upcoming events, workshops, and activities happening in your college.",
                  link: "/events",
                },
                {
                  icon: <FaUsers className="h-8 w-8 text-[#1a365d]" />,
                  title: "Community",
                  description: "Learn about our college community, clubs, and departments.",
                  link: "/about",
                },
                {
                  icon: <FaBullhorn className="h-8 w-8 text-[#1a365d]" />,
                  title: "Feedback",
                  description: "Share your thoughts and suggestions to help us improve.",
                  link: "/feedback",
                }
              ].map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="group bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <span className="bg-indigo-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </span>
                      <h3 className="ml-4 text-2xl font-semibold text-[#1a365d]">{card.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{card.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Events Section */}
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#1a365d] flex items-center">
                  <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FaCalendarAlt className="h-6 w-6 text-[#1a365d]" />
                  </span>
                  Recent Events
                </h2>
                <Link
                  to="/events"
                  className="px-6 py-2.5 bg-[linear-gradient(135deg,#1a365d_0%,#2b6cb0_100%)] text-white rounded-full font-bold flex items-center gap-2 shadow-md hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all"
                >
                  View All Events
                  <FaArrowRight className="ml-1 text-white h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-3 flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d]"></div>
                  </div>
                ) : recentEvents.length > 0 ? (
                  recentEvents.map((event) => (
                    <div 
                      key={event.id || event._id} 
                      className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-[#1a365d] mb-3">{event.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600 bg-indigo-50 p-2 rounded-lg">
                            <FaCalendarAlt className="mr-2 text-[#1a365d] h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 bg-indigo-50 p-2 rounded-lg">
                            <FaClock className="mr-2 text-[#1a365d] h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 bg-indigo-50 p-2 rounded-lg">
                            <FaMapMarkerAlt className="mr-2 text-[#1a365d] h-4 w-4" />
                            <span>{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 bg-white rounded-2xl shadow-xl">
                    <FaCalendarAlt className="h-12 w-12 mx-auto mb-4 text-[#1a365d]" />
                    <p className="text-lg text-gray-500">No upcoming events at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Visitors Count Box - at the bottom of the page */}
        <div className="flex justify-center mx-auto mb-20">
          <div className="inline-flex items-center justify-center bg-indigo-50 rounded-full shadow-2xl px-5 py-2 border border-indigo-100">
            <span className="bg-indigo-100 p-2 rounded-full flex items-center justify-center mr-2">
              <FaEye className="h-5 w-5 text-[#1a365d]" />
            </span>
            <span className="text-base font-semibold text-[#1a365d]">Visitors:</span>
            <span className="text-lg font-bold text-[#1a365d] ml-2">{visitorCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


