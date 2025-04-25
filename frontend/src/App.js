import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Events from "./components/Events";
import Resources from "./components/Resources";
import About from "./components/About";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import DiscussionForum from "./components/DiscussionForum";
import Analytics from "./components/Analytics";
import Circular from "./components/Circular";
import ProtectedRoute from "./components/ProtectedRoute";
import { AUTHORIZED_ROLES } from "./config/roles";
import CreateEvent from './components/CreateEvent';
import CreateResource from './components/CreateResource';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';

// Separate component for the main app content
function AppContent() {
  const [hasVisited, setHasVisited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    // Check for existing auth state on app load
    const checkAuthState = () => {
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      const isAuth = localStorage.getItem('isAuthenticated');

      if (isAuth && userRole && userEmail) {
        setUser({ role: userRole, email: userEmail });
        setIsAuthenticated(true);
      }

      const visited = localStorage.getItem('hasVisited');
      if (visited) {
        setHasVisited(true);
      }
      setIsLoading(false);
    };

    checkAuthState();
  }, [setUser, setIsAuthenticated]);

  useEffect(() => {
    const handleStorageChange = () => {
      const visited = localStorage.getItem('hasVisited');
      setHasVisited(!!visited);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (userData) => {
    try {
      // Set user data in context
      setUser({ role: userData.role, email: userData.email });
      setIsAuthenticated(true);

      // Store in localStorage
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('isAuthenticated', 'true');

      // You can add additional login success handling here
      console.log('User logged in successfully:', userData.email);
    } catch (error) {
      console.error('Login error:', error);
      // Handle any login errors here
    }
  };

  const RequireVisited = ({ children }) => {
    return hasVisited ? children : <Navigate to="/" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      {hasVisited && <Navbar />}
      <Routes>
        <Route path="/" element={!hasVisited ? <LandingPage /> : <Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            <RequireVisited>
              <Home />
            </RequireVisited>
          }
        />
        <Route
          path="/auth"
          element={
            <RequireVisited>
              <Auth onLogin={handleLogin} />
            </RequireVisited>
          }
        />
        <Route
          path="/about"
          element={
            <RequireVisited>
              <About />
            </RequireVisited>
          }
        />
        <Route
          path="/events"
          element={
            <RequireVisited>
              <Events />
            </RequireVisited>
          }
        />
        <Route
          path="/resources"
          element={
            <RequireVisited>
              <Resources />
            </RequireVisited>
          }
        />
        
        {/* Protected Routes - Only accessible by authorized roles */}
        <Route
          path="/forum"
          element={
            <RequireVisited>
              <ProtectedRoute requiredRole={AUTHORIZED_ROLES}>
                <DiscussionForum />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireVisited>
              <ProtectedRoute requiredRole={AUTHORIZED_ROLES}>
                <Analytics />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/feedback"
          element={
            <RequireVisited>
              <ProtectedRoute requiredRole={AUTHORIZED_ROLES}>
                <Feedback />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/circular"
          element={
            <RequireVisited>
              <ProtectedRoute requiredRole={AUTHORIZED_ROLES}>
                <Circular />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/events/create"
          element={
            <RequireVisited>
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <RequireVisited>
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/resources/create"
          element={
            <RequireVisited>
              <ProtectedRoute>
                <CreateResource />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
        <Route
          path="/resources/edit/:id"
          element={
            <RequireVisited>
              <ProtectedRoute>
                <CreateResource />
              </ProtectedRoute>
            </RequireVisited>
          }
        />
      </Routes>
      {hasVisited && <Footer />}
    </Router>
  );
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
