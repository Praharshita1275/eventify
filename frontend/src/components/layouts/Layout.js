import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Chatbot from '../Chatbot';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout; 