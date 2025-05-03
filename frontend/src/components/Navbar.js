import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUser, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes, FaBook, FaCommentAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Base navigation links for all users (logged in or not)
  const navLinks = [
    { path: '/home', name: 'Home', icon: <FaHome className="text-white" /> },
    { path: '/about', name: 'About', icon: <FaUser className="text-white" /> },
    { path: '/events', name: 'Events', icon: <FaCalendarAlt className="text-white" /> },
    { path: '/feedback', name: 'Feedback', icon: <FaCommentAlt className="text-white" /> }
  ];

  // Add Circulars link for all users
  navLinks.push({ path: '/circulars', name: 'Circulars', icon: <FaBook className="text-white" /> });
  
  // Add Resources link only for authenticated users
  if (isAuthenticated) {
    navLinks.push({ path: '/resources', name: 'Resources', icon: <FaBook className="text-white" /> });
  }
  
  // Remove Forum and Analytics links
  // if (user && permissions.canManageCircular()) {
  //   navLinks.push(
  //     { path: '/forum', name: 'Forum', icon: <FaComments /> },
  //     { path: '/analytics', name: 'Analytics', icon: <FaChartBar /> }
  //   );
  // }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo flex items-center space-x-2">
            <span className="hover:text-white hover:underline transition-all">Eventify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
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
                className="navbar-button bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:bg-[linear-gradient(135deg,_#dc2626_0%,_#991b1b_100%)] transition-all"
              >
                <FaSignOutAlt className="text-white" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="navbar-button bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:bg-[linear-gradient(135deg,_#059669_0%,_#065f46_100%)] transition-all"
              >
                <FaSignInAlt className="text-white" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="navbar-mobile-button bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all"
            >
            {isMenuOpen ? <FaTimes className="text-white" /> : <FaBars className="text-white" />}
            </button>
        </div>

        {/* Mobile menu */}
        <div className={`navbar-mobile-menu ${isMenuOpen ? 'block' : 'hidden'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="navbar-mobile-link w-full text-left bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:bg-[linear-gradient(135deg,_#dc2626_0%,_#991b1b_100%)] transition-all"
            >
              <FaSignOutAlt className="text-white" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="navbar-mobile-link bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:bg-[linear-gradient(135deg,_#059669_0%,_#065f46_100%)] transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSignInAlt className="text-white" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

