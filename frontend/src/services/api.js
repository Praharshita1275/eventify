import axios from 'axios';

// Determine base URL based on environment
const getBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Default to port 5001 in development, or relative path in production
  return process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000, // Increase timeout even more
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Disable sending cookies as we're using Bearer token
});

// Debug function to inspect token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Current token in localStorage:', token ? `${token.substring(0, 15)}...` : 'No token found');
  return token;
};

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token for each request (in case it changed)
    const token = getAuthToken();
    
    // Perform offline check before making request
    if (!navigator.onLine) {
      console.log(`[API] Device offline, preventing request to: ${config.url}`);
      // Create a custom error for offline status
      const error = new Error('You are currently offline. Please try again when you have internet access.');
      error.isOffline = true;
      return Promise.reject(error);
    }
    
    if (token) {
      // Ensure we always set the Authorization header with the Bearer token
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Adding token to request headers for: ${config.url}`);
    } else {
      // Don't warn for public endpoints
      if (!config.url.includes('/events') && config.method !== 'get') {
        console.warn(`[API] No auth token found in localStorage for request: ${config.url}`);
      }
    }

    // Add Accept header
    config.headers.Accept = 'application/json';
    
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Successful response from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log('[API] Error intercepted:', error.message);
    
    if (error.response) {
      // Server responded with error
      console.log(`[API] Response status: ${error.response.status}`);
      console.log(`[API] Request URL: ${error.config.url}`);
      console.log('[API] Error response:', error.response.data);
      
      if (error.response.status === 401) {
        // Handle 401 errors - invalid/expired token
        console.log('[API] Unauthorized access detected');
        
        // Clear any invalid tokens
        if (localStorage.getItem('token')) {
          console.log('[API] Clearing invalid token');
          localStorage.removeItem('token');
          
          // We don't redirect to login for event creation - let component handle it
          if (!error.config.url.includes('/events') || error.config.method !== 'post') {
            // For other endpoints, notify the user session expired
            const event = new CustomEvent('auth:sessionExpired');
            window.dispatchEvent(event);
          }
        }
      }
    } else if (error.request) {
      // Request was made but no response received - network error
      console.log('[API] Network error - no response received');
      const event = new CustomEvent('api:networkError', { 
        detail: { url: error.config?.url } 
      });
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default api;