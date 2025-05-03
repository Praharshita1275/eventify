import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        // Use the login function from context
        login(response.data.user, response.data.token);
        navigate('/home');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
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
            <FaCalendarAlt className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-extrabold text-[#1a365d] tracking-tight mb-2">
            Welcome to Eventify
          </h2>
          <p className="text-gray-600 text-lg">
            Sign in to manage and participate in events
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm backdrop-filter relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] rounded-full opacity-5" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] rounded-full opacity-5" />

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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-[#1a365d] font-semibold mb-2 text-center">Test Credentials</p>
            <div className="font-mono text-sm text-gray-600 space-y-1">
              <p className="flex items-center justify-between">
                <span>Email:</span>
                <span className="text-[#2b6cb0]">aec@cbit.ac.in</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Password:</span>
                <span className="text-[#2b6cb0]">aec123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your CSS/Tailwind
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.clip-pattern {
  clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);
}
`;

export default Login;
