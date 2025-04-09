import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Details:", { email, password });
    // Add authentication logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue managing events
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
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
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
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
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-gray-600 text-sm">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 font-bold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

