import axios from 'axios';

// Base URL for API requests
const API_URL = 'http://127.0.0.1:8000';

// Keys for localStorage
const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'user_data';

// Set up axios defaults
axios.defaults.baseURL = API_URL;

// Function to set auth tokens in localStorage
export const setAuthTokens = (tokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  
  // Set the default Authorization header for all future requests
  if (tokens && tokens.access) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
  }
};

// Function to get auth tokens from localStorage
export const getAuthTokens = () => {
  const tokens = localStorage.getItem(TOKEN_KEY);
  return tokens ? JSON.parse(tokens) : null;
};

// Function to set user data in localStorage
export const setUserData = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

// Function to get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const tokens = getAuthTokens();
  return !!tokens && !!tokens.access;
};

// Function to logout (clear tokens and user data)
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

// Function to refresh the access token
export const refreshToken = async () => {
  try {
    const tokens = getAuthTokens();
    if (!tokens || !tokens.refresh) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/users/token/refresh/', {
      refresh: tokens.refresh
    });

    if (response.data && response.data.access) {
      // Update the access token
      const newTokens = {
        ...tokens,
        access: response.data.access
      };
      setAuthTokens(newTokens);
      return newTokens;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    // If refresh fails, logout the user
    logout();
    throw error;
  }
};

// Set up axios interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't tried to refresh yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await refreshToken();
        
        // Retry the original request with the new token
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Initialize axios headers from localStorage on app load
const tokens = getAuthTokens();
if (tokens && tokens.access) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
} 