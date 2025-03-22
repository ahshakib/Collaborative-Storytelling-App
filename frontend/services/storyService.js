import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all stories with pagination and filters
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise} - API response
 */
export const getAllStories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}/stories?${queryString}`);
  return response.data;
};

/**
 * Get a single story by ID
 * @param {string} id - Story ID
 * @returns {Promise} - API response
 */
export const getStoryById = async (id) => {
  const response = await axios.get(`${API_URL}/stories/${id}`);
  return response.data;
};

/**
 * Create a new story
 * @param {Object} storyData - Story data
 * @returns {Promise} - API response
 */
export const createStory = async (storyData) => {
  const response = await axios.post(`${API_URL}/stories`, storyData);
  return response.data;
};

/**
 * Update a story
 * @param {string} id - Story ID
 * @param {Object} storyData - Updated story data
 * @returns {Promise} - API response
 */
export const updateStory = async (id, storyData) => {
  const response = await axios.put(`${API_URL}/stories/${id}`, storyData);
  return response.data;
};

/**
 * Delete a story
 * @param {string} id - Story ID
 * @returns {Promise} - API response
 */
export const deleteStory = async (id) => {
  const response = await axios.delete(`${API_URL}/stories/${id}`);
  return response.data;
};