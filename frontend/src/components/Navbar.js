import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaBook, FaInfoCircle, FaComments, FaChartBar, FaBullhorn, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const permissions = usePermissions();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/home', name: 'Home', icon: <FaHome /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle /> },
    { path: '/events', name: 'Events', icon: <FaCalendarAlt /> },
    { path: '/resources', name: 'Resources', icon: <FaBook /> }
  ];

  // Add protected routes only for authorized users
  if (user && permissions.canManageCircular()) {
    navLinks.push(
      { path: '/forum', name: 'Forum', icon: <FaComments /> },
      { path: '/analytics', name: 'Analytics', icon: <FaChartBar /> },
      { path: '/circular', name: 'Circular', icon: <FaBullhorn /> }
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-[28px] font-bold text-white">
            Eventify
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-white bg-white/20 rounded-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10 rounded-lg'
                } flex items-center space-x-1 text-sm font-medium transition-colors duration-200 px-4 py-2`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
            
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={logout}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-100 focus:outline-none"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden py-2`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                isActive(link.path)
                  ? 'text-white bg-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors duration-200`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

