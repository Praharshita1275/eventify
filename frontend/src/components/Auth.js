import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth({ onRegister, onLogin }) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Toggle between Login and Register mode
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setPasswordError("");
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) return "Password must be at least 8 characters.";
    if (!uppercase.test(password)) return "Password must include at least one uppercase letter.";
    if (!lowercase.test(password)) return "Password must include at least one lowercase letter.";
    if (!number.test(password)) return "Password must include at least one number.";
    if (!specialChar.test(password)) return "Password must include at least one special character.";

    return ""; // Valid password
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Validate password during registration
      const error = validatePassword(password);
      if (error) {
        setPasswordError(error);
        return;
      }

      console.log("Registering:", { name, email, password });
      if (onRegister) onRegister({ name, email, password });

      setIsLogin(true);
      setName(""); 
    } else {
      console.log("Logging in:", { email, password });
      if (onLogin) onLogin({ email, password });

      navigate("/about");
    }
  };

  // Disable button if fields are empty or password is invalid
  const isFormValid = isLogin ? email && password : name && email && password && !passwordError;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-white to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-blue-300 transform transition duration-300 hover:scale-105">
        
        {/* Header Section */}
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-4">
          {isLogin ? "Welcome Back!" : "Join Eventify Today"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Login to continue" : "Create an account to get started"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!isLogin) setPasswordError(validatePassword(e.target.value));
              }}
              required
            />
            {/* Display password error */}
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 ${
              isFormValid
                ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 font-bold cursor-pointer transition hover:underline"
            onClick={toggleAuthMode}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
