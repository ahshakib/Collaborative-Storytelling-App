import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} - API response
 */
export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/auth/me`);
  return response.data;
};

/**
 * Update user profile
 * @param {Object} userData - User profile data to update
 * @returns {Promise} - API response
 */
export const updateProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/auth/profile`, userData);
  return response.data;
};

/**
 * Change user password
 * @param {Object} passwordData - Old and new password data
 * @returns {Promise} - API response
 */
export const changePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/auth/password`, passwordData);
  return response.data;
};

/**
 * Request password reset email
 * @param {string} email - User email
 * @returns {Promise} - API response
 */
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
  return response.data;
};

/**
 * Verify JWT token
 * @returns {Promise} - API response
 */
export const verifyToken = async () => {
  const response = await axios.get(`${API_URL}/auth/verify`);
  return response.data;
};