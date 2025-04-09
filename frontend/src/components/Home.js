import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate(); // Initialize navigation

  // Function to navigate to Auth Page
  const handleNavigate = () => {
    navigate('/auth');
  };

  return (
    <div 
      className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center px-4 relative"
      style={{ backgroundImage: "url('/assests/bgpic.jpg')" }} // Use public folder path
    >
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>

      {/* Content Section */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
          Welcome to <span className="text-secondary">Eventify</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8 leading-relaxed">
          Seamlessly manage your events with powerful tools and real-time updates.
        </p>

        <button
          onClick={handleNavigate} // Navigate to Auth page on click
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full shadow-2xl 
          hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out font-semibold text-lg animate-bounce"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;


