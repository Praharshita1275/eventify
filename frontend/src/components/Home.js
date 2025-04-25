import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBook, FaUsers, FaClock, FaMapMarkerAlt, FaBullhorn, FaArrowRight } from 'react-icons/fa';
import '../styles/animations.css';

function Home() {
  const [recentEvents, setRecentEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentEvents();
    fetchAnnouncements();
  }, []);

  const fetchRecentEvents = async () => {
    try {
      const response = await fetch('/api/events?limit=3');
      if (response.ok) {
        const data = await response.json();
        setRecentEvents(data);
      }
    } catch (error) {
      console.error('Error fetching recent events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements?limit=5');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Welcome to Eventify
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore events, access resources, and stay connected with your college community.
          </p>
        </div>

        {/* About Eventify Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
              <FaUsers className="h-6 w-6" />
            </span>
            About Eventify
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="text-lg mb-8 leading-relaxed">
              Eventify is your comprehensive college event management and resource sharing platform designed specifically for CBIT students and faculty. Our platform streamlines the way you discover, participate in, and manage college activities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaBook className="h-5 w-5 text-blue-600" />
                  </span>
                  For Students
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Stay updated with latest college events and activities
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Access study materials and resources
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Participate in discussions and forums
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Get instant notifications for important announcements
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaUsers className="h-5 w-5 text-blue-600" />
                  </span>
                  For Faculty
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Create and manage department events
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Share academic resources and materials
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Make important announcements
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-3"></span>
                    Track event participation and engagement
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                <FaBullhorn className="h-6 w-6" />
              </span>
              Latest Announcements
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {announcements.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className="p-6 hover:bg-blue-50 transition-colors duration-200 transform hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{announcement.content}</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FaBullhorn className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No new announcements at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {[
            {
              icon: <FaCalendarAlt className="h-8 w-8" />,
              title: "Events",
              description: "View upcoming events, workshops, and activities happening in your college.",
              link: "/events",
              color: "blue"
            },
            {
              icon: <FaBook className="h-8 w-8" />,
              title: "Resources",
              description: "Access study materials, previous year papers, and academic resources.",
              link: "/resources",
              color: "green"
            },
            {
              icon: <FaUsers className="h-8 w-8" />,
              title: "Community",
              description: "Learn about our college community, clubs, and departments.",
              link: "/about",
              color: "purple"
            }
          ].map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="p-8">
                <div className={`flex items-center mb-6`}>
                  <span className={`bg-${card.color}-100 text-${card.color}-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </span>
                  <h3 className="ml-4 text-2xl font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Events Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                <FaCalendarAlt className="h-6 w-6" />
              </span>
              Recent Events
            </h2>
            <Link
              to="/events"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              View All Events
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <FaClock className="mr-2 text-blue-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl shadow-xl">
                <FaCalendarAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">No upcoming events at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


