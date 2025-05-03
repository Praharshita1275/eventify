/**
 * Test Authentication Script
 * 
 * This script helps debug authentication issues by:
 * 1. Checking if a token exists in localStorage
 * 2. Validating the token format
 * 3. Manually setting a test token if needed
 * 
 * Run this in your browser console to debug auth issues
 */

function testAuthentication() {
  console.log("=== AUTHENTICATION DEBUGGING ===");
  
  // Check for token
  const token = localStorage.getItem('token');
  console.log("Current token:", token ? `${token.substring(0, 20)}...` : 'No token found');
  
  // Check other auth-related localStorage items
  console.log("User data:", localStorage.getItem('user'));
  console.log("User role:", localStorage.getItem('userRole'));
  console.log("User email:", localStorage.getItem('userEmail'));
  console.log("Is authenticated flag:", localStorage.getItem('isAuthenticated'));
  
  if (!token) {
    console.log("No token found. Authentication will fail.");
    console.log("To fix: Please login or use the setTestToken() function below.");
    return false;
  }
  
  try {
    // Basic validation - check if token has JWT structure (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error("Token format is invalid! Not a proper JWT token.");
      return false;
    }
    
    // Try to decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    console.log("Token payload:", payload);
    
    // Check expiration
    if (payload.exp) {
      const expiryDate = new Date(payload.exp * 1000);
      const now = new Date();
      console.log("Token expires:", expiryDate.toLocaleString());
      
      if (expiryDate < now) {
        console.error("TOKEN EXPIRED! Please login again.");
        return false;
      } else {
        const timeRemaining = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
        console.log(`Token valid for ~${timeRemaining} more days`);
      }
    }
    
    console.log("Token appears valid!");
    return true;
  } catch (err) {
    console.error("Error parsing token:", err);
    return false;
  }
}

function setTestToken() {
  // Sample user data
  const userData = {
    id: 'test-user-123',
    username: 'test_user',
    email: 'test@example.com',
    role: 'admin',
    college: 'CBIT',
    department: 'CSE'
  };
  
  // Store a long-lived token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJpYXQiOjE2MTY1MzIwMDAsImV4cCI6MTk4MDAwMDAwMH0.test-signature-for-debugging';
  
  // Set all localStorage values
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('userRole', userData.role);
  localStorage.setItem('userEmail', userData.email);
  localStorage.setItem('userId', userData.id);
  localStorage.setItem('isAuthenticated', 'true');
  
  console.log("Test authentication data set! Refresh the page and try again.");
  return true;
}

function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
  localStorage.removeItem('isAuthenticated');
  
  console.log("All authentication data cleared!");
}

// Export functions to window for console use
window.testAuthentication = testAuthentication;
window.setTestToken = setTestToken;
window.clearAuthData = clearAuthData;

console.log("Auth test functions loaded! Run testAuthentication() to check auth status.");
console.log("If you need to set a test token, run setTestToken()");
console.log("To clear all auth data, run clearAuthData()");

// Do not actually run this script automatically
// It's meant to be imported and run manually in console 