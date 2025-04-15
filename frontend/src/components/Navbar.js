import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaCalendarAlt, FaBook, FaComments, FaChartBar, FaCommentDots } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active link checker
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  // Handle Logout Function
  const handleLogout = () => {
    // Clear JWT token or session data
    localStorage.removeItem("token"); 
    // Redirect to Login Page
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
          Eventify
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/')}`}
          >
            <FaHome /> <span>Home</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/about')}`}
          >
            <FaInfoCircle /> <span>About</span>
          </Link>
          
          <Link 
            to="/events" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/events')}`}
          >
            <FaCalendarAlt /> <span>Events</span>
          </Link>
          
          <Link 
            to="/resources" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/resources')}`}
          >
            <FaBook /> <span>Resources</span>
          </Link>
          
          <Link 
            to="/forum" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/forum')}`}
          >
            <FaComments /> <span>Forum</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/analytics')}`}
          >
            <FaChartBar /> <span>Analytics</span>
          </Link>
          
          <Link 
            to="/feedback" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${isActive('/feedback')}`}
          >
            <FaCommentDots /> <span>Feedback</span>
          </Link>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

