import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Handle Logout Function
  const handleLogout = () => {
    // Clear JWT token or session data
    localStorage.removeItem("token"); 
    // Redirect to Login Page
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo or Brand Name */}
      <h1 className="text-2xl font-bold">
        <Link to="/">Eventify</Link>
      </h1>

      {/* Navigation Links */}
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-200">Home</Link>
        <Link to="/about" className="hover:text-gray-200">About</Link>
        <Link to="/events" className="hover:text-gray-200">Events</Link>
        <Link to="/resources" className="hover:text-gray-200">Resources</Link>
        <Link to="/feedback" className="hover:text-gray-200">Feedback</Link> {/* ✅ Added Feedback Page */}
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-all"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;

