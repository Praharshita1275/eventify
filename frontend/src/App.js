import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layouts/Layout';
import HomeLayout from './components/layouts/HomeLayout';
import Home from './components/Home';
import About from './components/About';
import Events from './components/Events';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import Feedback from './components/Feedback';
import Circulars from './components/Circulars';
import Circular from './components/Circular';
import Resources from './components/Resources';
import Auth from './components/Auth';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home route with no navbar */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
        </Route>

        {/* Other routes with navbar */}
        <Route element={<Layout />}>
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
          <Route path="/events/create" element={<PageTransition><CreateEvent /></PageTransition>} />
          <Route path="/events/edit/:id" element={<PageTransition><EditEvent /></PageTransition>} />
          <Route path="/feedback" element={<PageTransition><Feedback /></PageTransition>} />
          <Route path="/circulars" element={<PageTransition><Circulars /></PageTransition>} />
          <Route path="/circular/:eventId" element={<PageTransition><Circular /></PageTransition>} />
          <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;
