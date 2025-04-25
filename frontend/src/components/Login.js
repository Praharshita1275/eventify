import React, { useState, useEffect } from "react";
import axios from "axios";

const authorizedRoles = [
  "Club Head",
  "Director of Student Affairs",
  "Director of IQAC",
  "CDC",
  "AEC"
];

// Create axios instance with base URL and configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Test backend connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test');
        console.log('Backend connection test:', response.data);
      } catch (err) {
        console.error('Backend connection test failed:', err);
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    // Create IQAC Director account if it doesn't exist
    const createIQACAccount = async () => {
      try {
        console.log("Attempting to create IQAC account...");
        const response = await api.post("/auth/register", {
          username: "IQAC Director",
          email: "iqac@cbit.ac.in",
          password: "iqac123456",
          role: "Director of IQAC",
          college: "CBIT",
          department: "IQAC"
        });
        console.log("IQAC account created successfully:", response.data);
      } catch (err) {
        console.log("Registration attempt response:", err.response?.data);
        if (!err.response?.data?.message?.includes("already exists")) {
          console.error("Error creating IQAC account:", err.response?.data || err.message);
        }
      }
    };
    createIQACAccount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", { email });
      const response = await api.post("/auth/login", { email, password });
      console.log("Login response:", response.data);
      
      const user = response.data.user;
      console.log("User role:", user.role);
      console.log("Authorized roles:", authorizedRoles);
      
      if (!authorizedRoles.includes(user.role)) {
        console.log("Role not authorized:", user.role);
        setError("You are not authorized to log in.");
        return;
      }
      
      console.log("Login successful, calling onLoginSuccess");
      onLoginSuccess(user, response.data.token);
    } catch (err) {
      console.error("Login error full:", err);
      console.error("Login error response:", err.response?.data);
      if (err.response?.status === 404) {
        setError("Server not found. Please check if the backend is running.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to manage events and resources
        </p>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">Test Credentials:</p>
          <p className="font-mono">Email: iqac@cbit.ac.in</p>
          <p className="font-mono">Password: iqac123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
