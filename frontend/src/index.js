import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ensure correct path
import './index.css';
import './test-auth'; // Import auth testing script

// Create root and render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
