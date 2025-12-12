import api from '../utils/api';

/**
 * Get all stories with pagination and filters
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise} - API response
 */
export const getAllStories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/stories?${queryString}`);
  return response.data;
};

/**
 * Get a single story by ID
 * @param {string} id - Story ID
 * @returns {Promise} - API response
 */
export const getStoryById = async (id) => {
  const response = await api.get(`/stories/${id}`);
  return response.data;
};

/**
 * Create a new story
 * @param {Object} storyData - Story data
 * @returns {Promise} - API response
 */
export const createStory = async (storyData) => {
  const response = await api.post('/stories', storyData);
  return response.data;
};

/**
 * Update a story
 * @param {string} id - Story ID
 * @param {Object} storyData - Updated story data
 * @returns {Promise} - API response
 */
export const updateStory = async (id, storyData) => {
  const response = await api.put(`/stories/${id}`, storyData);
  return response.data;
};

/**
 * Delete a story
 * @param {string} id - Story ID
 * @returns {Promise} - API response
 */
export const deleteStory = async (id) => {
  const response = await api.delete(`/stories/${id}`);
  return response.data;
};