import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaExclamationTriangle, FaEnvelope, FaLock, FaUserShield, FaServer } from "react-icons/fa";
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [redirectMessage, setRedirectMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        await api.get('/');
        setServerStatus('online');
      } catch (err) {
        console.error('Server connection error:', err);
        setServerStatus('offline');
      }
    };
    checkServerConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { user, token } = response.data;
        login(user, token);
        navigate('/home');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setError('Unable to connect to the server. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white to-indigo-50">
      {/* Left side decorative pattern */}
      <div className="fixed left-0 top-0 h-full w-1/3 bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] opacity-10 clip-pattern" />
      
      <div className="w-full max-w-md">
        {/* Logo and Title Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] text-white mb-4 shadow-lg">
            <FaUserShield className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-extrabold text-[#1a365d] tracking-tight mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 text-lg">
            Sign in to access protected resources
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm backdrop-filter relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] rounded-full opacity-5" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] rounded-full opacity-5" />

          {/* Server Status */}
          {serverStatus === 'offline' && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg animate-fadeIn">
              <div className="flex items-center">
                <FaServer className="text-amber-500 mr-3 h-5 w-5" />
                <p className="text-sm text-amber-700">
                  Server is currently unavailable. Login with test credentials still works.
                </p>
              </div>
            </div>
          )}

          {/* Redirect Message */}
          {redirectMessage && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg animate-fadeIn">
              <div className="flex">
                <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-3 h-5 w-5" />
                <p className="text-sm text-amber-700">{redirectMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg animate-fadeIn">
              <div className="flex">
                <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-3 h-5 w-5" />
                <p className="text-sm text-amber-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[linear-gradient(135deg,#1a365d_0%,#2b6cb0_100%)] text-white rounded-xl hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
