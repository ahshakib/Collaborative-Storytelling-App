import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Create a new contribution
 * @param {Object} contributionData - Contribution data
 * @returns {Promise} - API response
 */
export const createContribution = async (contributionData) => {
  const response = await axios.post(`${API_URL}/contributions`, contributionData);
  return response.data;
};

/**
 * Get all contributions for a story
 * @param {string} storyId - Story ID
 * @returns {Promise} - API response
 */
export const getStoryContributions = async (storyId) => {
  const response = await axios.get(`${API_URL}/contributions/story/${storyId}`);
  return response.data;
};

/**
 * Get a single contribution by ID
 * @param {string} id - Contribution ID
 * @returns {Promise} - API response
 */
export const getContributionById = async (id) => {
  const response = await axios.get(`${API_URL}/contributions/${id}`);
  return response.data;
};

/**
 * Update a contribution
 * @param {string} id - Contribution ID
 * @param {Object} contributionData - Updated contribution data
 * @returns {Promise} - API response
 */
export const updateContribution = async (id, contributionData) => {
  const response = await axios.put(`${API_URL}/contributions/${id}`, contributionData);
  return response.data;
};

/**
 * Delete a contribution
 * @param {string} id - Contribution ID
 * @returns {Promise} - API response
 */
export const deleteContribution = async (id) => {
  const response = await axios.delete(`${API_URL}/contributions/${id}`);
  return response.data;
};